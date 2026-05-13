from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from openai import AsyncOpenAI
from app.database import get_session
from app.models import Ticket, TicketStatus
from app.config import LLM_API_URL, LLM_API_KEY

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.get("")
async def get_tickets(
    status: TicketStatus | None = None,
    session: AsyncSession = Depends(get_session),
):
    query = select(Ticket)
    if status:
        query = query.where(Ticket.status == status)
    result = await session.exec(query)
    return result.all()


@router.get("/{ticket_id}")
async def get_ticket(
    ticket_id: int,
    session: AsyncSession = Depends(get_session),
):
    ticket = await session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/{ticket_id}/summary")
async def get_ticket_summary(
    ticket_id: int,
    session: AsyncSession = Depends(get_session),
):
    ticket = await session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    client = AsyncOpenAI(base_url=LLM_API_URL, api_key=LLM_API_KEY)

    async def stream():
        response = await client.chat.completions.create(
            model="unsloth/Qwen3.5-9B",
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Summarize this help desk ticket in 2-3 sentences.\n\n"
                        f"Title: {ticket.title}\n"
                        f"Description: {ticket.description}"
                    ),
                }
            ],
            stream=True,
        )
        async for chunk in response:
            token = chunk.choices[0].delta.content
            if token:
                yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")

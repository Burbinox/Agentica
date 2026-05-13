from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import get_session
from app.models import Ticket, TicketStatus

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

from fastapi import APIRouter, Depends
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

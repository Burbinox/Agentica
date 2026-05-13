from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field


class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"


class Ticket(SQLModel, table=True):
    __tablename__ = "tickets"
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str
    status: TicketStatus = Field(default=TicketStatus.open)
    created_at: datetime = Field(default_factory=datetime.utcnow)

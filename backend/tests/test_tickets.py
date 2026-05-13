import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture(scope="session")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_get_tickets_returns_list(client):
    response = await client.get("/api/tickets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_tickets_filter_by_status(client):
    response = await client.get("/api/tickets?status=open")
    assert response.status_code == 200
    tickets = response.json()
    assert all(t["status"] == "open" for t in tickets)


async def test_get_ticket_by_id(client):
    response = await client.get("/api/tickets/1")
    assert response.status_code == 200
    ticket = response.json()
    assert ticket["id"] == 1
    assert "title" in ticket
    assert "description" in ticket
    assert "status" in ticket


async def test_get_ticket_not_found(client):
    response = await client.get("/api/tickets/99999")
    assert response.status_code == 404

import { useEffect, useState } from 'react'
import type { Ticket } from '../types'

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

interface Props {
  onSelect: (ticket: Ticket) => void
}

export default function TicketList({ onSelect }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/tickets')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch tickets')
        return r.json()
      })
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Agentica Help Desk App</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} onClick={() => onSelect(ticket)} style={{ cursor: 'pointer' }}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>
                <span className={`status status-${ticket.status}`}>
                  {STATUS_LABEL[ticket.status]}
                </span>
              </td>
              <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

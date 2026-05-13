import { useEffect, useState } from 'react'
import type { Ticket, TicketStatus } from '../types'

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const FILTERS: { label: string; value: TicketStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
]

interface Props {
  onSelect: (ticket: Ticket) => void
}

export default function TicketList({ onSelect }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<TicketStatus | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url = activeFilter ? `/api/tickets?status=${activeFilter}` : '/api/tickets'
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch tickets')
        return r.json()
      })
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [activeFilter])

  const sorted = [...tickets].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return sortAsc ? diff : -diff
  })

  return (
    <div>
      <h1>Agentica Help Desk App</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.value)}
            className={activeFilter === f.value ? 'primary' : ''}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th
                onClick={() => setSortAsc((prev) => !prev)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Created {sortAsc ? '↑' : '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ticket) => (
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
      )}
    </div>
  )
}

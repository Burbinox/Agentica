import { useState } from 'react'
import type { Ticket } from '../types'

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

interface Props {
  ticket: Ticket
  onBack: () => void
}

export default function TicketDetail({ ticket, onBack }: Props) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateSummary() {
    setSummary('')
    setError(null)
    setLoading(true)
    const es = new EventSource(`/api/tickets/${ticket.id}/summary`)
    es.onmessage = (e) => {
      if (e.data === '[DONE]') {
        es.close()
        setLoading(false)
        return
      }
      setSummary((prev) => prev + e.data)
    }
    es.onerror = () => {
      es.close()
      setLoading(false)
      setError('Error during generating response. Please try again.')
    }
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <div className="ticket-detail">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>{ticket.title}</h2>
          <span className={`status status-${ticket.status}`}>
            {STATUS_LABEL[ticket.status]}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
          #{ticket.id} · Created {new Date(ticket.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
        <p>{ticket.description}</p>

        <button
          className="primary"
          onClick={generateSummary}
          disabled={loading}
          style={{ marginTop: '24px', marginBottom: 0 }}
        >
          {loading ? <><span className="spinner" />Generating...</> : 'Generate Summary'}
        </button>

        {error && <p style={{ marginTop: '12px', color: '#f87171', fontSize: '14px' }}>{error}</p>}
        {summary && <div className="summary-box">{summary}</div>}
      </div>
    </div>
  )
}

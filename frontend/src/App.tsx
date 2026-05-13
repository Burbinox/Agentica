import { useState } from 'react'
import TicketList from './components/TicketList'
import type { Ticket } from './types'

export default function App() {
  const [selected, setSelected] = useState<Ticket | null>(null)

  return (
    <main>
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)}>← Back</button>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
        </div>
      ) : (
        <TicketList onSelect={setSelected} />
      )}
    </main>
  )
}

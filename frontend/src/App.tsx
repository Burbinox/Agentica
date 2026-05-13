import { useState } from 'react'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import type { Ticket } from './types'

export default function App() {
  const [selected, setSelected] = useState<Ticket | null>(null)

  return (
    <main>
      {selected ? (
        <TicketDetail ticket={selected} onBack={() => setSelected(null)} />
      ) : (
        <TicketList onSelect={setSelected} />
      )}
    </main>
  )
}

import './style.css'
import ReactDOM from 'react-dom/client'
import DeckInput from './deck_input'

function App() {
  return (
    <DeckInput/>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />)

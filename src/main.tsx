import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import DeckInput from './deck_input'

function App() {
  return (
    <DeckInput></DeckInput>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />)

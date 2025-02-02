import { useState } from 'react'
import './App.css'
import BSTVisualizer from './BSTVisualizer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>helo</h1>
    <BSTVisualizer/>
    </>

  )
}

export default App

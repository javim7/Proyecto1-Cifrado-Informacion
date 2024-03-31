import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Login from './components/Login'
import Landing from './components/Landing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login /> */}
      <Landing />
    </>
  )
}

export default App

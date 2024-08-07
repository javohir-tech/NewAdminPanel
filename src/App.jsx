import { useState } from 'react'
import './App.css'
import Login from './Pages/Login/Login'
import { Route, Routes } from 'react-router-dom'
import Home from './Layout/Layout'
import Categories from './Pages/Categories/Categories'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
     <Login/>
    </>
  )
}

export default App

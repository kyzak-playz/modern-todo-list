import React from 'react'
import SearchBar from './components/SearchBar'
import Logo from './components/Logo'
import SiginBtn from './components/SiginBtn'

const App = () => {
  return (
    <nav className=' flex justify-between items-center p-4 m-4'>
      <Logo />
      <SearchBar />
      <SiginBtn />
    </nav>
  )
}

export default App

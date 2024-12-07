import React from 'react'
import StartingPage from './StartingPage'
import Landingpage from './Landingpage'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

const Allroutes = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landingpage />} />
        <Route path='/get-started' element={<StartingPage />} />
      </Routes>
    // </BrowserRouter>
  )
}
export default Allroutes
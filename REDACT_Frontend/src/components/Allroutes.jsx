import React from 'react'
import StartingPage from './StartingPage'
import Landingpage from './Landingpage'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Redact_doc from './Redact_doc'

const Allroutes = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landingpage />} />
        <Route path='/get-started' element={<StartingPage />} />
        <Route path='/redact-doc' element={<Redact_doc />} />
      </Routes>
    // </BrowserRouter>
  )
}
export default Allroutes
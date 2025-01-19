import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/SignInPage';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import PopulateDbPage from './pages/PopulateDbPage';
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-orange-800 via-amber-500 to-orange-800 flex items-center justify-center relative overflow-hidden">
      <Toaster />
      <Routes>
        
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path='/signin' element={<LoginPage/>}/>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/filter' element={<FilterPage/>}/>
        <Route path='/populatedb' element={<PopulateDbPage/>}/>

      </Routes>
    </div>
  )
}

export default App
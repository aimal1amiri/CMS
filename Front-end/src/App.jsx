import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/SignInPage';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import PopulateDbPage from './pages/PopulateDbPage';
import {Toaster} from 'react-hot-toast'
import { useAuthenticationStore } from './store/authStore';

const App = () => {
  const ProtectedRoute = ({children}) => {
    const {user} = useAuthenticationStore();
  
    if(!user){
      return <Navigate to="/signin" replace/>
  
    }  
  
    return children   
  }
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-orange-800 via-amber-500 to-orange-800 flex items-center justify-center relative overflow-hidden">
      <Toaster />
      <Routes>
        
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path='/signin' element={<LoginPage/>}/>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/search' element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/>
        <Route path='/filter' element={<ProtectedRoute><FilterPage/></ProtectedRoute>}/>
        <Route path='/populatedb' element={<ProtectedRoute><PopulateDbPage/></ProtectedRoute>}/>

      </Routes>
    </div>
  )
}

export default App
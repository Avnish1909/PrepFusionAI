import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
export const serverUrl = "http://localhost:5000"
import SmartLookup from "./pages/SmartLookup";
import Navbar from './components/Navbar'
import CodeEditorHome from "./pages/codeEditor/Home";
import EditorPage from "./pages/codeEditor/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
   getCurrentUser(dispatch)
  },[dispatch])

  const {userData} = useSelector((state)=>state.user)
 return (
  <>

    {userData && <Navbar />}
    <Toaster position="top-right" />
    <Routes>

      <Route
        path='/'
        element={userData ? <Home /> : <Navigate to="/auth" replace />}
      />

      <Route
        path='/auth'
        element={userData ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route
        path='/history'
        element={userData ? <History /> : <Navigate to="/auth" replace />}
      />

      <Route
        path='/notes'
        element={userData ? <Notes /> : <Navigate to="/auth" replace />}
      />

      <Route
        path='/pricing'
        element={userData ? <Pricing /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/smart-lookup"
        element={<SmartLookup />}
      />
      <Route path="/editor" element={<CodeEditorHome />} />

      <Route path="/editor/:roomId" element={<EditorPage />} />
      <Route
        path='/payment-success'
        element={<PaymentSuccess />}
      />

      <Route
        path='/payment-failed'
        element={<PaymentFailed />}
      />

    </Routes>

  </>
)
}

export default App

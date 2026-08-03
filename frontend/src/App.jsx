// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from './store/authSlice'; // ✅ Fixed import
import './App.css';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';
import Admin from './pages/Admin';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkUser());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/problem/:id" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={
            isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
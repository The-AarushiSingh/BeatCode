// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProblems } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const dispatch = useDispatch();
  const { problems, loading } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ MOVE useTheme INSIDE the component
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    dispatch(getProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const filteredProblems = problems?.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="badge-easy">Easy</span>;
      case 'Medium':
        return <span className="badge-medium">Medium</span>;
      case 'Hard':
        return <span className="badge-hard">Hard</span>;
      default:
        return <span style={{ color: '#6b6b6b' }}>{difficulty}</span>;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#0a0a0a' : '#f5f5f5',
      color: darkMode ? '#ffffff' : '#1a1a1a',
      fontFamily: 'Inter, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 3D Background Gradients */}
      <div style={{
        position: 'fixed',
        top: '-300px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-300px',
        left: '-200px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 1,
        padding: '16px 32px',
        background: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: darkMode ? '1px solid rgba(108, 99, 255, 0.1)' : '1px solid rgba(108, 99, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Link to="/" style={{
          color: darkMode ? '#ffffff' : '#1a1a1a',
          textDecoration: 'none',
          fontSize: '22px',
          fontWeight: '900',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BeatCode
        </Link>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
              borderRadius: '8px',
              color: darkMode ? '#8b8b8b' : '#6b6b6b',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#6c63ff';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Dashboard Link */}
          <Link to="/dashboard" style={{
            padding: '6px 16px',
            background: 'transparent',
            border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
            borderRadius: '8px',
            color: darkMode ? '#8b8b8b' : '#6b6b6b',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#6c63ff';
            e.target.style.color = '#6c63ff';
            e.target.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
            e.target.style.color = darkMode ? '#8b8b8b' : '#6b6b6b';
            e.target.style.boxShadow = 'none';
          }}>
            Dashboard
          </Link>

          {/* Leaderboard Link */}
          <Link to="/leaderboard" style={{
            padding: '6px 16px',
            background: 'transparent',
            border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
            borderRadius: '8px',
            color: darkMode ? '#8b8b8b' : '#6b6b6b',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#eab308';
            e.target.style.color = '#eab308';
            e.target.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
            e.target.style.color = darkMode ? '#8b8b8b' : '#6b6b6b';
            e.target.style.boxShadow = 'none';
          }}>
            Leaderboard
          </Link>

          <span style={{ color: darkMode ? '#8b8b8b' : '#6b6b6b', fontSize: '14px' }}>
            {user?.firstName || 'User'}
          </span>

          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              padding: '6px 16px',
              background: 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)',
              borderRadius: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 12px rgba(108, 99, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 20px rgba(108, 99, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 12px rgba(108, 99, 255, 0.2)';
            }}>
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
              borderRadius: '8px',
              color: darkMode ? '#8b8b8b' : '#6b6b6b',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
              e.target.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
              e.target.style.color = darkMode ? '#8b8b8b' : '#6b6b6b';
              e.target.style.boxShadow = 'none';
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
              borderRadius: '12px',
              color: darkMode ? '#ffffff' : '#1a1a1a',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6c63ff';
              e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '8px 16px',
            background: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: darkMode ? '1px solid rgba(108, 99, 255, 0.1)' : '1px solid rgba(108, 99, 255, 0.2)'
          }}>
            <span style={{ color: darkMode ? '#6b6b6b' : '#8b8b8b', fontSize: '13px' }}>Problems </span>
            <span style={{ color: darkMode ? '#ffffff' : '#1a1a1a', fontWeight: '600' }}>{problems?.length || 0}</span>
          </div>
          <div style={{
            padding: '8px 16px',
            background: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: darkMode ? '1px solid rgba(34, 197, 94, 0.1)' : '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <span style={{ color: darkMode ? '#6b6b6b' : '#8b8b8b', fontSize: '13px' }}>Solved </span>
            <span style={{ color: '#22c55e', fontWeight: '600' }}>
              {user?.problemSolved?.length || 0}
            </span>
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: darkMode ? '#6b6b6b' : '#8b8b8b' }}>
            Loading...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: darkMode ? '#6b6b6b' : '#8b8b8b' }}>
            {searchTerm ? 'No results found' : 'No problems available'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {filteredProblems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problem/${problem._id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: darkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid #2a2a2a' : '1px solid #d1d1d1',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: darkMode ? '#ffffff' : '#1a1a1a',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6c63ff';
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(108, 99, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = darkMode ? '#2a2a2a' : '#d1d1d1';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '4px' }}>
                    {problem.title}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 8px',
                          background: darkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(200, 200, 200, 0.6)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: darkMode ? '#8b8b8b' : '#6b6b6b'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '4px' }}>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#6b6b6b' : '#8b8b8b' }}>
                    {problem.submissions || 0} submissions
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
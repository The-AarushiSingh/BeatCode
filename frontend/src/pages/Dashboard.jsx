// frontend/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSolvedProblems } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { solvedProblems, loading } = useSelector((state) => state.problems);

  useEffect(() => {
    dispatch(getSolvedProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const totalSolved = solvedProblems?.length || 0;
  const easyCount = solvedProblems?.filter(p => p.difficulty === 'Easy').length || 0;
  const mediumCount = solvedProblems?.filter(p => p.difficulty === 'Medium').length || 0;
  const hardCount = solvedProblems?.filter(p => p.difficulty === 'Hard').length || 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      <header style={{
        padding: '16px 32px',
        background: 'rgba(20, 20, 20, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '22px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BeatCode
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#8b8b8b' }}>{user?.firstName || 'User'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#8b8b8b',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2a2a2a';
              e.target.style.color = '#8b8b8b';
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#6b6b6b', marginBottom: '32px' }}>Track your progress and achievements</p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(108, 99, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#6c63ff' }}>{totalSolved}</div>
            <div style={{ color: '#6b6b6b', fontSize: '13px' }}>Problems Solved</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>{easyCount}</div>
            <div style={{ color: '#6b6b6b', fontSize: '13px' }}>Easy</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(234, 179, 8, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#eab308' }}>{mediumCount}</div>
            <div style={{ color: '#6b6b6b', fontSize: '13px' }}>Medium</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{hardCount}</div>
            <div style={{ color: '#6b6b6b', fontSize: '13px' }}>Hard</div>
          </div>
        </div>

        {/* Solved Problems List */}
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Solved Problems</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b6b' }}>Loading...</div>
        ) : solvedProblems?.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'rgba(20, 20, 20, 0.8)',
            borderRadius: '12px',
            border: '1px solid #2a2a2a'
          }}>
            <p style={{ color: '#6b6b6b' }}>You haven't solved any problems yet.</p>
            <Link to="/" style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)',
              borderRadius: '8px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Start Solving
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {solvedProblems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problem/${problem._id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  background: 'rgba(20, 20, 20, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid #2a2a2a',
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6c63ff';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div>
                  <div style={{ fontWeight: '500' }}>{problem.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b6b6b' }}>
                    {problem.tags?.join(', ') || ''}
                  </div>
                </div>
                <div style={{
                  color: problem.difficulty === 'Easy' ? '#22c55e' : 
                         problem.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                  fontWeight: '600',
                  fontSize: '13px'
                }}>
                  {problem.difficulty}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
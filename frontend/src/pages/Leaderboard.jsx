// frontend/src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import axios from 'axios';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/problems/leaderboard');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getMedalColor = (index) => {
    if (index === 0) return '#ffd700';
    if (index === 1) return '#c0c0c0';
    if (index === 2) return '#cd7f32';
    return '#6b6b6b';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Header */}
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

      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🏆 Leaderboard</h1>
        <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>Top coders on BeatCode</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b6b' }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'rgba(20, 20, 20, 0.8)',
            borderRadius: '12px',
            border: '1px solid #2a2a2a'
          }}>
            <p style={{ color: '#6b6b6b' }}>No users yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {users.map((userData, index) => (
              <div
                key={userData._id || index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: index < 3 ? 'rgba(20, 20, 20, 0.9)' : 'rgba(20, 20, 20, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: index < 3 ? `1px solid ${getMedalColor(index)}40` : '1px solid #2a2a2a',
                  boxShadow: index < 3 ? `0 0 30px ${getMedalColor(index)}10` : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: index < 3 ? '24px' : '16px',
                    fontWeight: index < 3 ? '700' : '400',
                    color: getMedalColor(index),
                    minWidth: '40px'
                  }}>
                    {getMedal(index)}
                  </span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{userData.username || userData.email || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#6b6b6b' }}>
                      {userData.solvedCount || 0} problems solved
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: '#6c63ff' }}>
                    {userData.solvedCount || 0}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b6b6b' }}>
                    {userData.acceptanceRate?.toFixed(1) || 0}% acceptance
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
// frontend/src/components/Heatmap.jsx
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import axios from 'axios';

const Heatmap = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, [userId]);

  const fetchHeatmapData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/submissions/heatmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Transform data for heatmap
      const heatmapData = response.data.map(item => ({
        date: item.date,
        count: item.count
      }));
      setData(heatmapData);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
      // Fallback data for demo
      const today = new Date();
      const fallbackData = [];
      for (let i = 30; i > 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        fallbackData.push({
          date: date.toISOString().split('T')[0],
          count: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
        });
      }
      setData(fallbackData);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ color: '#6b6b6b', padding: '20px', textAlign: 'center' }}>Loading activity...</div>;
  }

  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #2a2a2a'
    }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        📊 Activity Heatmap
      </h3>
      <div style={{ 
        '--heatmap-color': '#6c63ff',
        '--heatmap-bg': '#1a1a2e'
      }}>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={data}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            if (value.count >= 4) return 'color-scale-4';
            if (value.count >= 3) return 'color-scale-3';
            if (value.count >= 2) return 'color-scale-2';
            return 'color-scale-1';
          }}
          gutterSize={2}
          showWeekdayLabels={true}
          titleForValue={(value) => {
            if (!value || value.count === 0) return 'No activity';
            return `${value.count} submission${value.count > 1 ? 's' : ''} on ${value.date}`;
          }}
        />
      </div>
      <style jsx>{`
        .react-calendar-heatmap .color-empty {
          fill: #2a2a2a;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #4f46e5;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #6c63ff;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #8b7ff7;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #a78bfa;
        }
        .react-calendar-heatmap text {
          fill: #6b6b6b;
          font-size: 8px;
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', fontSize: '12px', color: '#6b6b6b' }}>
        <span>Less</span>
        <span style={{ width: '12px', height: '12px', background: '#2a2a2a', borderRadius: '2px' }}></span>
        <span style={{ width: '12px', height: '12px', background: '#4f46e5', borderRadius: '2px' }}></span>
        <span style={{ width: '12px', height: '12px', background: '#6c63ff', borderRadius: '2px' }}></span>
        <span style={{ width: '12px', height: '12px', background: '#8b7ff7', borderRadius: '2px' }}></span>
        <span style={{ width: '12px', height: '12px', background: '#a78bfa', borderRadius: '2px' }}></span>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
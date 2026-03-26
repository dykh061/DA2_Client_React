import React, { useState } from 'react';
import './RevenueChart.css';

const RevenueChart = () => {
  // State để chuyển đổi giữa xem theo 'Tuần' hoặc 'Tháng'
  const [view, setView] = useState('weekly');

  // Dữ liệu đầy đủ cho chế độ xem theo Tuần
  const weeklyData = [
    { label: 'T2', value: 65, amount: '1.2M' },
    { label: 'T3', value: 45, amount: '0.9M' },
    { label: 'T4', value: 85, amount: '2.1M' },
    { label: 'T5', value: 30, amount: '0.6M' },
    { label: 'T6', value: 75, amount: '1.8M' },
    { label: 'T7', value: 100, amount: '2.5M' },
    { label: 'CN', value: 90, amount: '2.2M' },
  ];

  // Dữ liệu đầy đủ cho chế độ xem theo Tháng
  const monthlyData = [
    { label: 'T1', value: 40, amount: '12M' },
    { label: 'T2', value: 55, amount: '15M' },
    { label: 'T3', value: 80, amount: '22M' },
    { label: 'T4', value: 100, amount: '30M' },
  ];

  const currentData = view === 'weekly' ? weeklyData : monthlyData;
  
  // Logic tìm giá trị max/min để tô màu
  const values = currentData.map(d => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  return (
    <div className="revenue-chart-wrapper">
      <div className="chart-header">
        <div className="chart-info">
          <span className="info-item"><span className="dot max"></span> Cao nhất</span>
          <span className="info-item"><span className="dot min"></span> Thấp nhất</span>
        </div>
        
        <div className="chart-toggle">
          <button 
            className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Tuần
          </button>
          <button 
            className={`toggle-btn ${view === 'monthly' ? 'active' : ''}`}
            onClick={() => setView('monthly')}
          >
            Tháng
          </button>
        </div>
      </div>

      <div className="revenue-chart-container">
        <div className="chart-y-axis">
          <span>{view === 'weekly' ? '2.5M' : '30M'}</span>
          <span>{view === 'weekly' ? '1.2M' : '15M'}</span>
          <span>0</span>
        </div>

        <div className="chart-main">
          <div className="chart-bars">
            {currentData.map((item, index) => (
              <div key={index} className="bar-wrapper">
                <div 
                  className={`bar ${item.value === maxVal ? 'max' : ''} ${item.value === minVal ? 'min' : ''}`} 
                  style={{ height: `${item.value}%` }}
                >
                  <div className="bar-tooltip">{item.amount}</div>
                </div>
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="chart-grid">
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CỰC KỲ QUAN TRỌNG: Phải có dòng này để Dashboard.jsx import được
export default RevenueChart;
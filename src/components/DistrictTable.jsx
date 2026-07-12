// src/components/DistrictTable.jsx
import React from 'react';

export const DistrictTable = ({ districts }) => {
  // если районов нет, показываем информационное сообщение
  if (!districts || districts.length === 0) {
    return <p style={{ color: '#666' }}>Нет районов. Добавьте их в симуляцию.</p>;
  }

  // форматирует население: округляет и добавляет разделители тысяч
  const formatPopulation = (value) => {
    return Math.round(value).toLocaleString();
  };

  // форматирует бюджет: округляет и добавляет разделители тысяч
  const formatBudget = (value) => {
    return Math.round(value).toLocaleString();
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ background: '#34495e', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Название</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Тип</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Стратегия</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Население</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Удовл.</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Экология</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Бюджет</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((district, index) => (
            <tr key={district.id || index} style={{
              background: index % 2 === 0 ? 'white' : '#f8f9fa',
              transition: 'background 0.2s'
            }}>
              <td style={{ padding: '10px' }}>{district.name}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: '#e8f4f8',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {district.getType()}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: getStrategyColor(district.strategy),
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {district.strategy.constructor.name.replace('Strategy', '')}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                {formatPopulation(district.population)}
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                <span style={{ color: getIndicatorColor(district.satisfaction) }}>
                  {Math.round(district.satisfaction)}%
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                <span style={{ color: getIndicatorColor(district.ecology) }}>
                  {Math.round(district.ecology)}%
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                {formatBudget(district.budget)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// возвращает цвет для стратегии района
function getStrategyColor(strategy) {
  const name = strategy.constructor.name;
  switch (name) {
    case 'EcoStrategy': return '#4CAF50';
    case 'IndustrialStrategy': return '#FF9800';
    case 'InnovationStrategy': return '#2196F3';
    case 'TourismStrategy': return '#9C27B0';
    default: return '#9E9E9E';
  }
}

// возвращает цвет индикатора в зависимости от значения
function getIndicatorColor(value) {
  if (value > 70) return '#4CAF50';
  if (value > 40) return '#FFC107';
  return '#F44336';
}
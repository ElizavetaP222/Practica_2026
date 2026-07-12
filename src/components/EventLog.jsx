// src/components/EventLog.jsx
import React, { useRef, useEffect } from 'react';

export const EventLog = ({ events }) => {
  // ссылка на контейнер с логом для управления прокруткой
  const logContainerRef = useRef(null);

  // при появлении новых событий прокручиваем лог вверх
  useEffect(() => {
    if (logContainerRef.current && events.length > 0) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [events]);

  // если событий нет, показываем заглушку
  if (!events || events.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px'
      }}>
        <p>Событий пока нет</p>
      </div>
    );
  }

  // определяет категорию и цвета для каждого события
  const getEventStyle = (msg) => {
    // экономические события (синие)
    const economicEvents = [
      'ЭКОНОМИЧЕСКИЙ БУМ',
      'КРУПНЫЕ ИНВЕСТИЦИИ',
      'ГОСУДАРСТВЕННАЯ ПОДДЕРЖКА',
      'ФИНАНСОВЫЙ КРИЗИС',
      'РЕЦЕССИЯ',
      'БАНКРОТСТВО'
    ];
    
    // промышленные события (оранжевые)
    const industrialEvents = [
      'ОТКРЫТИЕ МЕСТОРОЖДЕНИЯ',
      'ТЕХНОЛОГИЧЕСКИЙ ПРОРЫВ'
    ];
    
    // экологические события (зелёные)
    const ecologicalEvents = [
      'ОЗЕЛЕНЕНИЕ',
      'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА',
      'УРАГАН',
      'НАВОДНЕНИЕ'
    ];
    
    // социальные события (фиолетовые)
    const socialEvents = [
      'ФЕСТИВАЛЬ',
      'ЭПИДЕМИЯ'
    ];

    // природные события (жёлтые)
    const naturalEvents = [
      'УРАГАН',
      'НАВОДНЕНИЕ',
      'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА'
    ];

    // выбираем стиль в зависимости от категории события
    if (economicEvents.some(e => msg.includes(e))) {
      return {
        color: '#0d47a1',
        bgColor: '#e3f2fd',
        borderColor: '#1976d2',
        category: 'Экономика'
      };
    } else if (industrialEvents.some(e => msg.includes(e))) {
      return {
        color: '#e65100',
        bgColor: '#fff3e0',
        borderColor: '#ff9800',
        category: 'Промышленность'
      };
    } else if (ecologicalEvents.some(e => msg.includes(e))) {
      return {
        color: '#1b5e20',
        bgColor: '#e8f5e9',
        borderColor: '#4caf50',
        category: 'Экология'
      };
    } else if (socialEvents.some(e => msg.includes(e))) {
      return {
        color: '#4a148c',
        bgColor: '#f3e5f5',
        borderColor: '#9c27b0',
        category: 'Социум'
      };
    } else if (naturalEvents.some(e => msg.includes(e))) {
      return {
        color: '#e65100',
        bgColor: '#fff8e1',
        borderColor: '#ffc107',
        category: 'Природа'
      };
    } else {
      // для неизвестных событий
      return {
        color: '#555',
        bgColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        category: 'Другое'
      };
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '400px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '16px', flexShrink: 0 }}>
        Лог событий
        <span style={{ fontSize: '11px', color: '#666', marginLeft: '8px' }}>
          (всего {events.length})
        </span>
      </h4>
      
      <div
        ref={logContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingRight: '4px',
          minHeight: 0
        }}
      >
        {events.map((msg, index) => {
          const style = getEventStyle(msg);

          return (
            <div
              key={index}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                background: style.bgColor,
                color: style.color,
                borderLeft: `4px solid ${style.borderColor}`,
                lineHeight: '1.4',
                flexShrink: 0
              }}
            >
              {msg}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventLog;
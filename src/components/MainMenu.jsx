import React, { useState } from 'react';

export const MainMenu = ({ onStartGame }) => {
  // состояние для количества районов
  const [districtCount, setDistrictCount] = useState(5);
  // состояние для бюджета города
  const [budget, setBudget] = useState(50000);
  // состояние для сложности игры
  const [difficulty, setDifficulty] = useState('medium');
  // состояние для частоты событий
  const [eventFrequency, setEventFrequency] = useState('medium');
  // состояние для типа города
  const [cityType, setCityType] = useState('balanced');

  // возвращает пресет районов в зависимости от типа города
  const getDistrictPreset = (type) => {
    switch (type) {
      case 'eco':
        return { residential: 2, industrial: 1, commercial: 1, green: 2 };
      case 'industrial':
        return { residential: 1, industrial: 3, commercial: 1, green: 1 };
      case 'commercial':
        return { residential: 1, industrial: 1, commercial: 3, green: 1 };
      case 'balanced':
      default:
        return { residential: 2, industrial: 2, commercial: 2, green: 1 };
    }
  };

  // вычисляет реальный состав районов с учётом общего количества
  const getActualDistrictComposition = (type, total) => {
    const preset = getDistrictPreset(type);
    const { residential, industrial, commercial, green } = preset;
    const totalPreset = residential + industrial + commercial + green;
    
    // считаем пропорции каждого типа
    const residentialRatio = residential / totalPreset;
    const industrialRatio = industrial / totalPreset;
    const commercialRatio = commercial / totalPreset;
    const greenRatio = green / totalPreset;
    
    // округляем до целых чисел
    let res = Math.round(total * residentialRatio);
    let ind = Math.round(total * industrialRatio);
    let com = Math.round(total * commercialRatio);
    let grn = Math.round(total * greenRatio);
    
    // корректируем сумму, чтобы она точно равнялась общему количеству
    const sum = res + ind + com + grn;
    const diff = total - sum;
    
    if (diff > 0) {
      // добавляем недостающие районы по очереди
      const order = ['residential', 'industrial', 'commercial', 'green'];
      let idx = 0;
      for (let i = 0; i < diff; i++) {
        const type = order[idx % order.length];
        if (type === 'residential') res++;
        else if (type === 'industrial') ind++;
        else if (type === 'commercial') com++;
        else if (type === 'green') grn++;
        idx++;
      }
    } else if (diff < 0) {
      // убираем лишние районы
      let toRemove = Math.abs(diff);
      while (toRemove > 0) {
        if (grn > 0) { grn--; toRemove--; }
        else if (com > 0) { com--; toRemove--; }
        else if (ind > 0) { ind--; toRemove--; }
        else if (res > 0) { res--; toRemove--; }
      }
    }
    
    return { residential: res, industrial: ind, commercial: com, green: grn };
  };

  // возвращает описание для выбранного типа города
  const getCityTypeDescription = (type) => {
    switch (type) {
      case 'eco':
        return 'Больше зелёных зон и жилых районов';
      case 'industrial':
        return 'Больше промышленных районов';
      case 'commercial':
        return 'Больше коммерческих районов';
      case 'balanced':
      default:
        return 'Равномерное распределение всех типов';
    }
  };

  // получаем актуальный состав районов для отображения
  const composition = getActualDistrictComposition(cityType, districtCount);

  // обрабатывает запуск игры
  const handleStart = () => {
    const config = {
      totalDistricts: districtCount,
      totalBudget: budget,
      difficulty: difficulty,
      eventFrequency,
      cityType: cityType,
      districtPreset: getDistrictPreset(cityType),
      districtComposition: composition,
    };
    onStartGame(config);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '50px auto',
      padding: '28px 30px',
      fontFamily: 'Arial, sans-serif',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#1a1a2e',
        margin: '0 0 24px 0',
        fontSize: '22px',
        fontWeight: '600',
        letterSpacing: '-0.3px'
      }}>
        Симуляция города
      </h2>

      {/* настройка количества районов */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>Районы</span>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{districtCount}</span>
        </div>
        <input
          type="range"
          min="2"
          max="10"
          step="1"
          value={districtCount}
          onChange={(e) => setDistrictCount(Number(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, #4a6cf7 0%, #4a6cf7 ${((districtCount - 2) / 8) * 100}%, #e0e0e0 ${((districtCount - 2) / 8) * 100}%, #e0e0e0 100%)`
          }}
        />
      </div>

      {/* настройка бюджета */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>Бюджет</span>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>
            {budget.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setBudget(Math.max(10000, budget - 5000))}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              background: '#fafafa',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#555'
            }}
          >
            −
          </button>
          <button
            onClick={() => setBudget(budget + 5000)}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              background: '#fafafa',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#555'
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* выбор типа города */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '6px' }}>
          Тип города
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['balanced', 'eco', 'industrial', 'commercial'].map(type => {
            const labels = { balanced: 'Баланс', eco: 'Эко', industrial: 'Пром', commercial: 'Торг' };
            return (
              <button
                key={type}
                onClick={() => setCityType(type)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '20px',
                  border: cityType === type ? '2px solid #4a6cf7' : '1px solid #e0e0e0',
                  background: cityType === type ? '#4a6cf7' : '#fff',
                  color: cityType === type ? '#fff' : '#555',
                  fontSize: '12px',
                  fontWeight: cityType === type ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#4a6cf7',
          marginTop: '4px',
          textAlign: 'center'
        }}>
          {getCityTypeDescription(cityType)}
        </div>
        {/* отображение состава районов */}
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '2px',
          textAlign: 'center'
        }}>
          Жил {composition.residential} · Пром {composition.industrial} · Торг {composition.commercial} · Парк {composition.green}
        </div>
      </div>

      {/* сложность и частота событий */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '4px' }}>
            Сложность
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['easy', 'medium', 'hard'].map(level => {
              const labels = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };
              return (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: '6px',
                    border: difficulty === level ? '2px solid #4a6cf7' : '1px solid #e0e0e0',
                    background: difficulty === level ? '#f0f4ff' : '#fff',
                    color: difficulty === level ? '#4a6cf7' : '#555',
                    fontSize: '11px',
                    fontWeight: difficulty === level ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '4px' }}>
            События
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['low', 'medium', 'high'].map(freq => {
              const labels = { low: 'Редко', medium: 'Средне', high: 'Часто' };
              return (
                <button
                  key={freq}
                  onClick={() => setEventFrequency(freq)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: '6px',
                    border: eventFrequency === freq ? '2px solid #4a6cf7' : '1px solid #e0e0e0',
                    background: eventFrequency === freq ? '#f0f4ff' : '#fff',
                    color: eventFrequency === freq ? '#4a6cf7' : '#555',
                    fontSize: '11px',
                    fontWeight: eventFrequency === freq ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {labels[freq]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* кнопка запуска */}
      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '12px',
          background: '#4a6cf7',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = '#3a5cd5'}
        onMouseLeave={(e) => e.target.style.background = '#4a6cf7'}
      >
        Запустить
      </button>
    </div>
  );
};

export default MainMenu;
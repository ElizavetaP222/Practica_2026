import React, { useState, useEffect, useRef } from 'react';
import { City } from '../models/City';
import { EcoStrategy } from '../models/EcoStrategy';
import { IndustrialStrategy } from '../models/IndustrialStrategy';
import { InnovationStrategy } from '../models/InnovationStrategy';
import { TourismStrategy } from '../models/TourismStrategy';
import { ResidentialDistrict } from '../models/ResidentialDistrict';
import { IndustrialDistrict } from '../models/IndustrialDistrict';
import { CommercialDistrict } from '../models/CommercialDistrict';
import { GreenZone } from '../models/GreenZone';
import { DistrictTable } from './DistrictTable';
import { EventLog } from './EventLog';
import { CityMap } from './CityMap';

// список возможных названий для районов
const DISTRICT_NAMES = [
  'Центральный',
  'Ленинский',
  'Заводской',
  'Парковый',
  'Лесной',
  'Речной',
  'Сосновый',
  'Набережный',
  'Молодёжный',
  'Индустриальный'
];

// перемешивает массив для случайного выбора названий
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// возвращает уникальные названия для районов
const getUniqueNames = (count) => {
  const shuffled = shuffleArray(DISTRICT_NAMES);
  return shuffled.slice(0, count);
};

// возвращает случайное число в диапазоне
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// вычисляет уровень развития района на основе его показателей
const getDevelopmentLevel = (district) => {
  const populationScore = Math.min(100, (district.population / 2000) * 100);
  const satisfactionScore = district.satisfaction;
  const ecologyScore = district.ecology;
  const budgetScore = Math.min(100, (district.budget / 5000) * 100);
  
  return Math.round((populationScore * 0.25 + satisfactionScore * 0.3 + ecologyScore * 0.25 + budgetScore * 0.2));
};

// возвращает цвет индикатора в зависимости от значения
const getIndicatorColor = (value) => {
  if (value > 70) return '#4CAF50';
  if (value > 40) return '#FFC107';
  return '#F44336';
};

// собирает статистику по всем районам города
const getCityStats = (districts) => {
  if (districts.length === 0) {
    return {
      totalPopulation: 0,
      avgSatisfaction: 0,
      avgEcology: 0,
      totalBudget: 0,
      avgDevelopment: 0
    };
  }

  const totalPopulation = districts.reduce((sum, d) => sum + d.population, 0);
  const avgSatisfaction = Math.round(districts.reduce((sum, d) => sum + d.satisfaction, 0) / districts.length);
  const avgEcology = Math.round(districts.reduce((sum, d) => sum + d.ecology, 0) / districts.length);
  const totalBudget = districts.reduce((sum, d) => sum + d.budget, 0);
  const avgDevelopment = Math.round(districts.reduce((sum, d) => sum + getDevelopmentLevel(d), 0) / districts.length);

  return {
    totalPopulation,
    avgSatisfaction,
    avgEcology,
    totalBudget,
    avgDevelopment
  };
};

export const SimulationView = ({ config, onNewGame }) => {
  // инициализация симуляции с настройками из конфига
  const [simulation] = useState(() => {
    const sim = City.getInstance().simulation;
    sim.difficulty = config?.difficulty || 'medium';
    sim.frequency = config?.eventFrequency || 'medium'; 
    return sim;
  });
  
  const [turn, setTurn] = useState(0);
  const [districts, setDistricts] = useState(simulation.districts);
  const [events, setEvents] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const timerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // запускаем инициализацию игры при получении конфига
  useEffect(() => {
    if (!isInitialized && config) {
      initializeGame();
    }
  }, [config, isInitialized]);

  // управление таймером для автоматического хода
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (districts.length > 0) {
          handleNextTurn();
        } else {
          setIsRunning(false);
        }
      }, speed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, speed]);

  // создаёт начальное состояние игры
  const initializeGame = () => {
    simulation.districts = [];
    simulation.turn = 0;
    simulation.logger.logs = [];
    
    const totalBudget = config.totalBudget || 50000;
    const cityType = config.cityType || 'balanced';
    const composition = config.districtComposition || { residential: 2, industrial: 2, commercial: 2, green: 1 };
    
    const { residential, industrial, commercial, green } = composition;
    const totalDistricts = residential + industrial + commercial + green;
    
    const uniqueNames = getUniqueNames(totalDistricts);
    let nameIndex = 0;
    
    const getNextName = () => {
      if (nameIndex < uniqueNames.length) {
        return uniqueNames[nameIndex++];
      }
      return `Район ${nameIndex + 1}`;
    };
    
    const districtsToAdd = [];
    const totalPreset = residential + industrial + commercial + green;
    
    // возвращает веса для распределения бюджета в зависимости от типа города
    const getBudgetWeights = () => {
      if (totalPreset === 0) {
        return { residential: 0.25, industrial: 0.25, commercial: 0.25, green: 0.25 };
      }
      
      const weightsMap = {
        'eco': {
          residential: 0.30,
          industrial: 0.15,
          commercial: 0.20,
          green: 0.35
        },
        'industrial': {
          residential: 0.20,
          industrial: 0.40,
          commercial: 0.25,
          green: 0.15
        },
        'commercial': {
          residential: 0.20,
          industrial: 0.20,
          commercial: 0.45,
          green: 0.15
        },
        'balanced': {
          residential: 0.30,
          industrial: 0.25,
          commercial: 0.25,
          green: 0.20
        }
      };
      
      return weightsMap[cityType] || weightsMap.balanced;
    };
    
    const weights = getBudgetWeights();
    
    const budgetByType = {
      residential: Math.floor(totalBudget * weights.residential),
      industrial: Math.floor(totalBudget * weights.industrial),
      commercial: Math.floor(totalBudget * weights.commercial),
      green: Math.floor(totalBudget * weights.green)
    };
    
    const sumBudget = budgetByType.residential + budgetByType.industrial + budgetByType.commercial + budgetByType.green;
    const diff = totalBudget - sumBudget;
    if (diff > 0) {
      budgetByType.residential += diff;
    }
    
    // создаёт район с распределённым бюджетом
    const createDistrictWithBudget = (DistrictClass, name, strategy, typeBudget, count, config) => {
      const difficultyMultiplier = config?.difficulty === 'easy' ? 1.2 : 
                                   config?.difficulty === 'hard' ? 0.8 : 1;
      
      const district = new DistrictClass(name, strategy);
      
      let districtBudget;
      if (count > 0) {
        const variation = 0.9 + Math.random() * 0.2;
        districtBudget = Math.floor((typeBudget / count) * variation);
      } else {
        districtBudget = Math.floor(typeBudget * 0.5);
      }
      
      district.budget = Math.max(500, Math.floor(districtBudget * difficultyMultiplier));
      district.population = Math.floor(800 + Math.random() * 1200) * difficultyMultiplier;
      district.satisfaction = randomBetween(30, 80);
      district.ecology = randomBetween(30, 80);
      
      // добавляем уникальные свойства в зависимости от типа района
      if (district instanceof ResidentialDistrict) {
        district.density = randomBetween(50, 200);
        district.familySize = Math.random() * 2 + 2;
        district.crimeRate = Math.random() * 20;
      } else if (district instanceof IndustrialDistrict) {
        district.pollutionLevel = randomBetween(20, 80);
        district.productionVolume = Math.floor(100 + Math.random() * 500);
        district.workerCount = Math.floor(50 + Math.random() * 300);
      } else if (district instanceof CommercialDistrict) {
        district.numberOfStores = randomBetween(5, 30);
        district.trafficVolume = Math.floor(100 + Math.random() * 1000);
        district.revenue = Math.floor(2000 + Math.random() * 8000);
      } else if (district instanceof GreenZone) {
        district.greenArea = randomBetween(10, 50);
        district.treeCount = Math.floor(100 + Math.random() * 500);
        district.biodiversity = Math.random() * 100;
      }
      
      district.history = {
        population: [district.population],
        satisfaction: [district.satisfaction],
        ecology: [district.ecology],
        budget: [district.budget]
      };
      
      district.difficulty = config?.difficulty || 'medium';
      
      return district;
    };
    
    let strategies = [EcoStrategy, InnovationStrategy, TourismStrategy];
    
    // создаём жилые районы
    for (let i = 0; i < residential; i++) {
      const StrategyClass = strategies[i % strategies.length];
      const district = createDistrictWithBudget(
        ResidentialDistrict,
        getNextName(),
        new StrategyClass(),
        budgetByType.residential,
        residential,
        config
      );
      districtsToAdd.push(district);
    }
    
    // создаём промышленные районы
    strategies = [IndustrialStrategy, InnovationStrategy];
    for (let i = 0; i < industrial; i++) {
      const StrategyClass = strategies[i % strategies.length];
      const district = createDistrictWithBudget(
        IndustrialDistrict,
        getNextName(),
        new StrategyClass(),
        budgetByType.industrial,
        industrial,
        config
      );
      districtsToAdd.push(district);
    }
    
    // создаём коммерческие районы
    strategies = [InnovationStrategy, TourismStrategy];
    for (let i = 0; i < commercial; i++) {
      const StrategyClass = strategies[i % strategies.length];
      const district = createDistrictWithBudget(
        CommercialDistrict,
        getNextName(),
        new StrategyClass(),
        budgetByType.commercial,
        commercial,
        config
      );
      districtsToAdd.push(district);
    }
    
    // создаём зелёные зоны
    strategies = [EcoStrategy, TourismStrategy];
    for (let i = 0; i < green; i++) {
      const StrategyClass = strategies[i % strategies.length];
      const district = createDistrictWithBudget(
        GreenZone,
        getNextName(),
        new StrategyClass(),
        budgetByType.green,
        green,
        config
      );
      districtsToAdd.push(district);
    }
    
    // нормализация бюджета, чтобы сумма точно равнялась общему бюджету
    const totalActualBudget = districtsToAdd.reduce((sum, d) => sum + d.budget, 0);
    if (totalActualBudget > 0 && totalActualBudget !== totalBudget) {
      const scaleFactor = totalBudget / totalActualBudget;
      let adjustedTotal = 0;
      districtsToAdd.forEach((d, index) => {
        if (index === districtsToAdd.length - 1) {
          d.budget = Math.max(500, totalBudget - adjustedTotal);
        } else {
          d.budget = Math.max(500, Math.floor(d.budget * scaleFactor));
          adjustedTotal += d.budget;
        }
      });
    }
    
    simulation.districts.push(...districtsToAdd);
    setDistricts([...simulation.districts]);
    setTurn(0);
    setEvents([]);
    setIsRunning(false);
    setIsInitialized(true);
  };

  // обрабатывает переход к следующему ходу
  const handleNextTurn = () => {
    if (districts.length === 0) return;
    
    const newEvents = simulation.nextTurn();
    setTurn(simulation.turn);
    
    simulation.districts.forEach(district => {
      if (!district.history) {
        district.history = {
          population: [district.population],
          satisfaction: [district.satisfaction],
          ecology: [district.ecology],
          budget: [district.budget]
        };
      }
      district.history.population.push(district.population);
      district.history.satisfaction.push(district.satisfaction);
      district.history.ecology.push(district.ecology);
      district.history.budget.push(district.budget);
    });
    
    setDistricts([...simulation.districts]);
    setEvents(prevEvents => [...newEvents, ...prevEvents]);
  };

  // полностью сбрасывает игру
  const resetGame = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    simulation.districts = [];
    simulation.turn = 0;
    simulation.logger.logs = [];
    setDistricts([]);
    setEvents([]);
    setTurn(0);
    setSelectedDistrict(null);
    setIsInitialized(false);
    onNewGame();
  };

  // включает или выключает автоматический режим
  const toggleAutoPlay = () => {
    if (districts.length === 0) return;
    setIsRunning(!isRunning);
  };

  // меняет скорость симуляции
  const changeSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    if (isRunning) {
      setIsRunning(false);
      setTimeout(() => setIsRunning(true), 50);
    }
  };

  const speeds = [
    { label: '0.5x', value: 1500 },
    { label: '1x', value: 1000 },
    { label: '1.5x', value: 400 },
    { label: '2x', value: 150 },
  ];

  const cityStats = getCityStats(districts);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Симуляция развития города</h1>
          <p style={{ margin: '5px 0 0', color: '#7f8c8d' }}>
            Ход: {turn} | Районов: {districts.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={toggleAutoPlay}
            disabled={districts.length === 0}
            style={{ 
              fontSize: '16px', 
              padding: '8px 20px',
              background: districts.length === 0 ? '#bdc3c7' : (isRunning ? '#f39c12' : '#2ecc71'),
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: districts.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              if (districts.length > 0) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (districts.length > 0) {
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {isRunning ? '⏸ Пауза' : '▶ Начать симуляцию'}
          </button>

          <button 
            onClick={handleNextTurn} 
            disabled={districts.length === 0 || isRunning}
            style={{ 
              fontSize: '16px', 
              padding: '8px 20px',
              background: (districts.length === 0 || isRunning) ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (districts.length === 0 || isRunning) ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 5px rgba(52, 152, 219, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (districts.length > 0 && !isRunning) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (districts.length > 0 && !isRunning) {
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            Следующий ход
          </button>

          <button 
            onClick={resetGame} 
            style={{ 
              fontSize: '14px', 
              padding: '8px 16px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(231, 76, 60, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Новая игра
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '15px',
        flexWrap: 'wrap',
        padding: '10px 15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555', marginRight: '10px' }}>
          Скорость:
        </span>
        {speeds.map((s) => (
          <button
            key={s.value}
            onClick={() => changeSpeed(s.value)}
            style={{
              padding: '5px 14px',
              fontSize: '13px',
              background: speed === s.value ? '#667eea' : 'white',
              color: speed === s.value ? 'white' : '#333',
              border: speed === s.value ? '2px solid #667eea' : '2px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: speed === s.value ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (speed !== s.value) {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#f0f0ff';
              }
            }}
            onMouseLeave={(e) => {
              if (speed !== s.value) {
                e.target.style.borderColor = '#ddd';
                e.target.style.background = 'white';
              }
            }}
          >
            {s.label}
          </button>
        ))}
        <span style={{ 
          fontSize: '12px', 
          color: '#888',
          marginLeft: 'auto',
          background: isRunning ? '#e8f5e9' : '#f5f5f5',
          padding: '3px 12px',
          borderRadius: '12px'
        }}>
          {isRunning ? '▶ Идёт симуляция...' : '⏸ Остановлено'}
        </span>
      </div>

      {districts.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '15px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%)',
          borderRadius: '10px',
          border: '1px solid #c5d8e8'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Население</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a237e' }}>
              {Math.round(cityStats.totalPopulation).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Счастье</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: getIndicatorColor(cityStats.avgSatisfaction) }}>
              {Math.round(cityStats.avgSatisfaction)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Экология</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: getIndicatorColor(cityStats.avgEcology) }}>
              {Math.round(cityStats.avgEcology)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Бюджет</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a237e' }}>
              {Math.round(cityStats.totalBudget).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Развитие</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: getIndicatorColor(cityStats.avgDevelopment) }}>
              {Math.round(cityStats.avgDevelopment)}%
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ flex: '2' }}>
          <CityMap 
            districts={districts} 
            config={config}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>
        
        <div style={{ flex: '1' }}>
          <EventLog events={events} />
        </div>
      </div>

      <hr style={{ margin: '20px 0', border: '1px solid #ecf0f1' }} />

      <DistrictTable districts={districts} />
    </div>
  );
};

export default SimulationView;
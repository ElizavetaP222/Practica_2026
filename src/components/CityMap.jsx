import React, { useState, useEffect } from 'react';

export const CityMap = ({ districts, config, onSelectDistrict }) => {
  // состояние для выбранного района
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // состояние для карты
  const [map, setMap] = useState([]);
  // состояние для хранения позиций районов
  const [districtPositions, setDistrictPositions] = useState({});
  // флаг инициализации
  const [initialized, setInitialized] = useState(false);

  // размеры карты
  const MAP_COLS = 40;
  const MAP_ROWS = 25;

  // тип города из настроек
  const cityType = config?.cityType || 'balanced';

  // сколько человек на одну клетку
  const POPULATION_PER_CELL = 100;

  // вычисляет сколько клеток нужно для населения
  const calculateCellCount = (population) => {
    return Math.max(1, Math.ceil(population / POPULATION_PER_CELL));
  };

  // вычисляет размер района как сторону квадрата
  const calculateDistrictSize = (district) => {
    const cellCount = calculateCellCount(district.population);
    let size = Math.ceil(Math.sqrt(cellCount));
    return Math.max(1, size);
  };

  // базовые размеры для разных типов районов в зависимости от типа города
  const getBaseSizeForType = (districtType) => {
    const baseSizes = {
      'balanced': {
        'Жилой': 2,
        'Промышленный': 2,
        'Коммерческий': 2,
        'Зелёная зона': 2
      },
      'eco': {
        'Жилой': 3,
        'Промышленный': 1,
        'Коммерческий': 2,
        'Зелёная зона': 3
      },
      'industrial': {
        'Жилой': 1,
        'Промышленный': 3,
        'Коммерческий': 2,
        'Зелёная зона': 1
      },
      'commercial': {
        'Жилой': 2,
        'Промышленный': 1,
        'Коммерческий': 3,
        'Зелёная зона': 1
      }
    };
    return baseSizes[cityType]?.[districtType] || 2;
  };

  // проверяет, должен ли район исчезнуть
  const shouldDistrictDisappear = (district) => {
    return district.population <= 0;
  };

  // создает форму района из клеток
  const generateShape = (size, cellCount, seed) => {
    const cells = [];
    const maxCells = size * size;
    const targetCells = Math.min(cellCount, maxCells);
    
    // начинаем с центральной клетки
    const center = Math.floor(size / 2);
    cells.push({ dr: center, dc: center });
    
    // направления для добавления соседних клеток
    const directions = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
      { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
      { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
      { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
    ];
    
    let added = 1;
    let layer = 1;
    
    // добавляем клетки по слоям, пока не наберем нужное количество
    while (added < targetCells) {
      for (let r = -layer; r <= layer && added < targetCells; r++) {
        for (let c = -layer; c <= layer && added < targetCells; c++) {
          if (Math.abs(r) === layer || Math.abs(c) === layer) {
            const dr = center + r;
            const dc = center + c;
            if (dr >= 0 && dr < size && dc >= 0 && dc < size) {
              if (!cells.some(cell => cell.dr === dr && cell.dc === dc)) {
                cells.push({ dr, dc });
                added++;
              }
            }
          }
        }
      }
      layer++;
    }
    
    // перемешиваем клетки для случайной формы
    const shuffled = cells.slice(1);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((i + seed) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return [cells[0], ...shuffled];
  };

  // добавляет новые клетки рядом с существующими, проверяя что они свободны
  const addCellsNearExisting = (existingCells, count, size, seed, allUsedCells, rowOffset, colOffset) => {
    const newCells = [...existingCells];
    const usedPositions = new Set(existingCells.map(c => `${c.dr},${c.dc}`));
    const allOccupied = new Set(allUsedCells);
    
    const directions = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
      { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
      { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
      { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
    ];
    
    let added = 0;
    let attempts = 0;
    const maxAttempts = 3000;
    
    const totalCells = size * size;
    if (newCells.length >= totalCells) {
      return newCells;
    }
    
    while (added < count && attempts < maxAttempts) {
      attempts++;
      const randomIndex = Math.floor((seed + attempts) % existingCells.length);
      const cell = existingCells[randomIndex];
      
      // перемешиваем направления для случайности
      const shuffledDirs = [...directions];
      for (let i = shuffledDirs.length - 1; i > 0; i--) {
        const j = Math.floor((i + seed + attempts) % (i + 1));
        [shuffledDirs[i], shuffledDirs[j]] = [shuffledDirs[j], shuffledDirs[i]];
      }
      
      for (const dir of shuffledDirs) {
        if (added >= count) break;
        const newR = cell.dr + dir.dr;
        const newC = cell.dc + dir.dc;
        const key = `${newR},${newC}`;
        
        const absoluteRow = rowOffset + newR;
        const absoluteCol = colOffset + newC;
        
        // проверяем что клетка свободна и в пределах карты
        if (newR >= 0 && newR < size && newC >= 0 && newC < size && 
            !usedPositions.has(key) && 
            !allOccupied.has(key) &&
            absoluteRow >= 0 && absoluteRow < MAP_ROWS && 
            absoluteCol >= 0 && absoluteCol < MAP_COLS) {
          usedPositions.add(key);
          newCells.push({ dr: newR, dc: newC });
          added++;
        }
      }
    }
    
    return newCells;
  };

  // определяет цвет района на основе его типа и развития
  const getDistrictColor = (district) => {
    const type = district.getType();
    const development = (district.satisfaction + district.ecology) / 2;
    const brightness = 0.5 + (development / 100) * 0.5;
    
    const colors = {
      'Жилой': { r: 66, g: 165, b: 245 },
      'Промышленный': { r: 255, g: 152, b: 0 },
      'Коммерческий': { r: 255, g: 193, b: 7 },
      'Зелёная зона': { r: 76, g: 175, b: 80 },
    };

    const base = colors[type] || { r: 200, g: 200, b: 200 };
    const r = Math.floor(base.r * brightness);
    const g = Math.floor(base.g * brightness);
    const b = Math.floor(base.b * brightness);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // размещает районы на карте при первом запуске
  const initializePositions = (activeDistricts) => {
    const newPositions = {};
    const usedCells = new Set();

    for (const district of activeDistricts) {
      const cellCount = calculateCellCount(district.population);
      const size = calculateDistrictSize(district);
      const seed = district.id ? parseInt(district.id.slice(0, 8), 36) % 1000 : Math.random() * 1000;
      
      let placed = false;
      let attempts = 0;
      const maxAttempts = 500;

      while (!placed && attempts < maxAttempts) {
        attempts++;
        const row = Math.floor(Math.random() * (MAP_ROWS - size + 1));
        const col = Math.floor(Math.random() * (MAP_COLS - size + 1));
        
        const shape = generateShape(size, cellCount, seed + attempts);
        let canPlace = true;
        const cellsToCheck = [];

        // проверяем что все клетки формы свободны
        for (const { dr, dc } of shape) {
          const r = row + dr;
          const c = col + dc;
          if (r >= MAP_ROWS || c >= MAP_COLS || r < 0 || c < 0) {
            canPlace = false;
            break;
          }
          const key = `${r},${c}`;
          if (usedCells.has(key)) {
            canPlace = false;
            break;
          }
          cellsToCheck.push({ r, c, key });
        }

        if (canPlace) {
          for (const { key } of cellsToCheck) {
            usedCells.add(key);
          }
          newPositions[district.id] = {
            row,
            col,
            shape: shape.map(s => ({ dr: s.dr, dc: s.dc })),
            size: size,
            cellCount: cellCount
          };
          placed = true;
        }
      }

      if (!placed) {
        console.warn(`Не удалось разместить район ${district.name}`);
        continue;
      }
    }

    return newPositions;
  };

  // обновляет карту при изменении данных районов
  useEffect(() => {
    buildMap();
  }, [districts]);

  // основная функция построения карты
  const buildMap = () => {
    const newMap = [];
    for (let i = 0; i < MAP_ROWS; i++) {
      newMap[i] = [];
      for (let j = 0; j < MAP_COLS; j++) {
        newMap[i][j] = { type: 'empty', districtId: null };
      }
    }

    const activeDistricts = districts.filter(d => !shouldDistrictDisappear(d));
    
    if (activeDistricts.length === 0) {
      setMap(newMap);
      return;
    }

    let positions = districtPositions;
    if (!initialized || Object.keys(positions).length === 0) {
      positions = initializePositions(activeDistricts);
      setDistrictPositions(positions);
      setInitialized(true);
    }

    // собираем все занятые клетки
    const allUsedCells = new Set();
    for (const district of activeDistricts) {
      const pos = positions[district.id];
      if (!pos) continue;
      for (const { dr, dc } of pos.shape) {
        const row = pos.row + dr;
        const col = pos.col + dc;
        if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS) {
          allUsedCells.add(`${row},${col}`);
        }
      }
    }

    // обновляем каждый район
    for (const district of activeDistricts) {
      const pos = positions[district.id];
      if (!pos) continue;

      const newCellCount = calculateCellCount(district.population);
      const newSize = calculateDistrictSize(district);
      const color = getDistrictColor(district);
      
      let shape = pos.shape;
      let size = pos.size;
      let cellCount = pos.cellCount;
      
      // если количество клеток изменилось, обновляем форму
      if (cellCount !== newCellCount) {
        const seed = district.id ? parseInt(district.id.slice(0, 8), 36) % 1000 : Math.random() * 1000;
        
        if (newCellCount > cellCount) {
          const cellsToAdd = newCellCount - cellCount;
          const newShape = addCellsNearExisting(
            shape, 
            cellsToAdd, 
            newSize, 
            seed, 
            allUsedCells,
            pos.row,
            pos.col
          );
          shape = newShape;
        } else {
          // если клеток стало меньше, удаляем последние
          const shuffledShape = [...shape];
          const center = shuffledShape[0];
          const rest = shuffledShape.slice(1);
          for (let i = rest.length - 1; i > 0; i--) {
            const j = Math.floor((i + seed + 100) % (i + 1));
            [rest[i], rest[j]] = [rest[j], rest[i]];
          }
          const newShape = [center, ...rest.slice(0, newCellCount - 1)];
          shape = newShape;
        }
        
        // обновляем занятые клетки
        for (const { dr, dc } of shape) {
          const row = pos.row + dr;
          const col = pos.col + dc;
          if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS) {
            allUsedCells.add(`${row},${col}`);
          }
        }
        
        positions[district.id] = { ...pos, shape, size: newSize, cellCount: newCellCount };
        setDistrictPositions({ ...positions });
        size = newSize;
        cellCount = newCellCount;
      }

      // размещаем район на карте
      for (const { dr, dc } of shape) {
        const row = pos.row + dr;
        const col = pos.col + dc;
        if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS) {
          const isMainCell = dr === 0 && dc === 0;
          newMap[row][col] = {
            type: district.getType(),
            districtId: district.id,
            color: color,
            name: district.name,
            population: district.population,
            satisfaction: district.satisfaction,
            ecology: district.ecology,
            budget: district.budget,
            isMainCell: isMainCell,
            size: size,
            cellCount: cellCount
          };
        }
      }
    }

    setMap(newMap);
  };

  // обработчик клика по клетке
  const handleCellClick = (cell) => {
    if (cell.type !== 'empty') {
      const district = districts.find(d => d.id === cell.districtId);
      if (district) {
        setSelectedDistrict(district.id);
        if (onSelectDistrict) {
          onSelectDistrict(district);
        }
      }
    }
  };

  // поиск района по id
  const getDistrictById = (id) => {
    return districts.find(d => d.id === id);
  };

  // активные и исчезнувшие районы
  const activeDistricts = districts.filter(d => !shouldDistrictDisappear(d));
  const disappearedDistricts = districts.filter(d => shouldDistrictDisappear(d));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>Карта города</h4>
        <div style={{ fontSize: '11px', color: '#666' }}>
          {activeDistricts.length} районов
          {disappearedDistricts.length > 0 && ` | ${disappearedDistricts.length} исчезло`}
          <span style={{ marginLeft: '8px', background: '#fff', padding: '1px 8px', borderRadius: '10px', fontSize: '10px' }}>
            {cityType === 'eco' ? 'Эко' : cityType === 'industrial' ? 'Пром' : cityType === 'commercial' ? 'Торг' : 'Баланс'}
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${MAP_COLS}, 1fr)`,
        gap: '1.5px',
        background: '#c8e6c9',
        padding: '1.5px',
        borderRadius: '4px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        {map.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                aspectRatio: '1',
                background: cell.type !== 'empty' ? cell.color : '#f0f2f5',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                fontWeight: 'bold',
                cursor: cell.type !== 'empty' ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                position: 'relative',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                border: 'none',
                boxShadow: 'none'
              }}
              onClick={() => handleCellClick(cell)}
              onMouseEnter={(e) => {
                if (cell.type !== 'empty') {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.zIndex = '10';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (cell.type !== 'empty') {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.zIndex = '0';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {cell.type !== 'empty' && !cell.isMainCell && cell.size > 8 && (
                <span style={{ fontSize: '3px', opacity: 0.15 }}>•</span>
              )}
            </div>
          ))
        ))}
      </div>

      {selectedDistrict !== null && getDistrictById(selectedDistrict) && (
        <div style={{
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '12px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{getDistrictById(selectedDistrict).name}</strong>
            <button 
              onClick={() => setSelectedDistrict(null)}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '4px', marginTop: '6px' }}>
            <span><strong>Тип:</strong> {getDistrictById(selectedDistrict).getType()}</span>
            <span><strong>Стратегия:</strong> {getDistrictById(selectedDistrict).strategy.constructor.name.replace('Strategy', '')}</span>
            <span><strong>Население:</strong> {Math.round(getDistrictById(selectedDistrict).population).toLocaleString()}</span>
            <span><strong>Клеток:</strong> {calculateCellCount(getDistrictById(selectedDistrict).population)}</span>
            <span><strong>Удовлетворённость:</strong> {Math.round(getDistrictById(selectedDistrict).satisfaction)}%</span>
            <span><strong>Экология:</strong> {Math.round(getDistrictById(selectedDistrict).ecology)}%</span>
            <span><strong>Бюджет:</strong> {Math.round(getDistrictById(selectedDistrict).budget).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityMap;
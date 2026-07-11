// src/models/GameEvent.js

// базовый класс для всех событий
export class GameEvent {
  description = 'Событие';
  apply(districts) {
    throw new Error('Метод apply() должен быть переопределён');
  }
}

// положительные события

export class EconomicBoomEvent extends GameEvent {
  description = ' ЭКОНОМИЧЕСКИЙ БУМ: бюджеты районов значительно растут!';
  apply(districts) {
    // получаем сложность из первого района
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    // множитель в зависимости от сложности
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      const gain = Math.floor((200 + Math.random() * 300) * multiplier);
      d.budget += gain;
      d.satisfaction = Math.min(100, d.satisfaction + (6 * multiplier));
    });
  }
}

export class MajorInvestmentEvent extends GameEvent {
  description = ' КРУПНЫЕ ИНВЕСТИЦИИ: бюджеты районов сильно растут';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      const gain = Math.floor((400 + Math.random() * 600) * multiplier);
      d.budget += gain;
      d.satisfaction = Math.min(100, d.satisfaction + (5 * multiplier));
    });
  }
}

export class GovernmentSupportEvent extends GameEvent {
  description = ' ГОСУДАРСТВЕННАЯ ПОДДЕРЖКА: бюджеты районов растут';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      const gain = Math.floor((300 + Math.random() * 400) * multiplier);
      d.budget += gain;
      d.satisfaction = Math.min(100, d.satisfaction + (5 * multiplier));
    });
  }
}

export class ResourceDiscoveryEvent extends GameEvent {
  description = ' ОТКРЫТИЕ МЕСТОРОЖДЕНИЯ: бюджеты районов сильно растут';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      const gain = Math.floor((500 + Math.random() * 800) * multiplier);
      d.budget += gain;
      d.satisfaction = Math.min(100, d.satisfaction + (6 * multiplier));
      d.population += Math.floor((20 + Math.random() * 50) * multiplier);
    });
  }
}

export class TechBreakthroughEvent extends GameEvent {
  description = ' ТЕХНОЛОГИЧЕСКИЙ ПРОРЫВ: бюджеты и экология улучшаются';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      const gain = Math.floor((300 + Math.random() * 400) * multiplier);
      d.budget += gain;
      d.ecology = Math.min(100, d.ecology + (6 * multiplier));
      d.satisfaction = Math.min(100, d.satisfaction + (5 * multiplier));
    });
  }
}

export class GreeningEvent extends GameEvent {
  description = ' ОЗЕЛЕНЕНИЕ ГОРОДА: экология улучшается, бюджет тратится';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      d.ecology = Math.min(100, d.ecology + (6 * multiplier));
      d.budget = Math.max(0, d.budget - Math.floor(100 * multiplier));
      d.satisfaction = Math.min(100, d.satisfaction + (4 * multiplier));
    });
  }
}

export class FestivalEvent extends GameEvent {
  description = ' ГОРОДСКОЙ ФЕСТИВАЛЬ: удовлетворённость растёт, бюджет тратится';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const multiplier = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.6 : 1.0;
    districts.forEach(d => {
      d.satisfaction = Math.min(100, d.satisfaction + (6 * multiplier));
      d.budget = Math.max(0, d.budget - Math.floor(100 * multiplier));
      d.population += Math.floor((5 + Math.random() * 10) * multiplier);
    });
  }
}

// отрицательные события

export class FinancialCrisisEvent extends GameEvent {
  description = ' ФИНАНСОВЫЙ КРИЗИС: бюджеты районов резко сокращаются!';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    // сила кризиса в зависимости от сложности
    const severity = difficulty === 'easy' ? 0.4 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      const loss = Math.floor(d.budget * (0.25 + Math.random() * 0.2) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.satisfaction = Math.max(0, d.satisfaction - (8 * severity));
      d.population = Math.floor(d.population * (0.95 - Math.random() * 0.05 * severity));
    });
  }
}

export class RecessionEvent extends GameEvent {
  description = ' РЕЦЕССИЯ: бюджеты районов сокращаются';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.4 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      const loss = Math.floor(d.budget * (0.15 + Math.random() * 0.15) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.satisfaction = Math.max(0, d.satisfaction - (6 * severity));
      d.population = Math.floor(d.population * (0.95 - Math.random() * 0.03 * severity));
    });
  }
}

export class BankruptcyEvent extends GameEvent {
  description = ' БАНКРОТСТВО: промышленные районы теряют бюджет';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.4 : difficulty === 'hard' ? 1.8 : 1.0;
    // затрагивает только промышленные и коммерческие районы
    const affected = districts.filter(d => d.getType() === 'Промышленный' || d.getType() === 'Коммерческий');
    affected.forEach(d => {
      const loss = Math.floor(d.budget * (0.2 + Math.random() * 0.2) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.satisfaction = Math.max(0, d.satisfaction - (8 * severity));
      d.population = Math.floor(d.population * (0.92 - Math.random() * 0.03 * severity));
    });
  }
}

export class HurricaneEvent extends GameEvent {
  description = ' УРАГАН: бюджеты районов падают на восстановление';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      const loss = Math.floor((500 + Math.random() * 800) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.ecology = Math.max(0, d.ecology - (10 * severity));
      d.satisfaction = Math.max(0, d.satisfaction - (10 * severity));
      d.population = Math.floor(d.population * (0.92 - Math.random() * 0.03 * severity));
    });
  }
}

export class FloodEvent extends GameEvent {
  description = ' НАВОДНЕНИЕ: бюджеты падают на восстановление';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      const loss = Math.floor((300 + Math.random() * 500) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.ecology = Math.max(0, d.ecology - (8 * severity));
      d.satisfaction = Math.max(0, d.satisfaction - (8 * severity));
      d.population = Math.floor(d.population * (0.92 - Math.random() * 0.03 * severity));
    });
  }
}

export class EcologicalDisasterEvent extends GameEvent {
  description = ' ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА: экология и бюджеты падают';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      const loss = Math.floor((200 + Math.random() * 400) * severity);
      d.budget = Math.max(0, d.budget - loss);
      d.ecology = Math.max(0, d.ecology - (12 * severity));
      d.satisfaction = Math.max(0, d.satisfaction - (10 * severity));
      d.population = Math.floor(d.population * (0.88 - Math.random() * 0.03 * severity));
    });
  }
}

export class EpidemicEvent extends GameEvent {
  description = ' ЭПИДЕМИЯ: население сокращается, удовлетворённость падает';
  apply(districts) {
    const difficulty = districts.length > 0 ? districts[0].difficulty : 'medium';
    const severity = difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 1.8 : 1.0;
    districts.forEach(d => {
      d.population = Math.floor(d.population * (0.85 - Math.random() * 0.05 * severity));
      d.satisfaction = Math.max(0, d.satisfaction - (10 * severity));
      d.budget = Math.max(0, d.budget - Math.floor(300 * severity));
    });
  }
}
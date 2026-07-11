// src/utils/eventGenerator.js

import {
  EconomicBoomEvent,
  MajorInvestmentEvent,
  GovernmentSupportEvent,
  ResourceDiscoveryEvent,
  TechBreakthroughEvent,
  GreeningEvent,
  FestivalEvent,
  FinancialCrisisEvent,
  RecessionEvent,
  BankruptcyEvent,
  HurricaneEvent,
  FloodEvent,
  EcologicalDisasterEvent,
  EpidemicEvent
} from '../models/GameEvent';

// генерирует случайные события для симуляции
export function generateRandomEvent(districts, difficulty = 'medium', frequency = 'medium') {
  const events = [];
  
  // вероятность события в зависимости от выбранной частоты
  const frequencyChances = {
    'low': 0.15,      // редко - 15%
    'medium': 0.30,   // средне - 30%
    'high': 0.50      // часто - 50%
  };
  
  const eventChance = frequencyChances[frequency] || frequencyChances.medium;
  const chance = Math.random();

  // проверяем, произойдёт ли событие
  if (chance < eventChance) {
    // вероятность положительных событий зависит от сложности
    let positiveChance = 0.70; // для лёгкой сложности
    if (difficulty === 'medium') positiveChance = 0.50; // для средней
    else if (difficulty === 'hard') positiveChance = 0.25; // для сложной
    
    const eventType = Math.random();
    
    // выбираем положительное событие
    if (eventType < positiveChance) {
      const subType = Math.random();
      if (subType < 0.25) events.push(new EconomicBoomEvent());
      else if (subType < 0.45) events.push(new MajorInvestmentEvent());
      else if (subType < 0.65) events.push(new GovernmentSupportEvent());
      else if (subType < 0.82) events.push(new ResourceDiscoveryEvent());
      else if (subType < 0.93) events.push(new TechBreakthroughEvent());
      else if (subType < 0.97) events.push(new GreeningEvent());
      else events.push(new FestivalEvent());
    } 
    // выбираем отрицательное событие
    else {
      const subType = Math.random();
      if (subType < 0.20) events.push(new FinancialCrisisEvent());
      else if (subType < 0.40) events.push(new RecessionEvent());
      else if (subType < 0.55) events.push(new BankruptcyEvent());
      else if (subType < 0.70) events.push(new HurricaneEvent());
      else if (subType < 0.85) events.push(new FloodEvent());
      else if (subType < 0.95) events.push(new EcologicalDisasterEvent());
      else events.push(new EpidemicEvent());
    }
  }
  
  return events;
}
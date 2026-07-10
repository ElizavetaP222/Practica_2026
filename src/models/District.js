import { IStrategy } from './IStrategy';

export class District {
  constructor(name, strategy) {
    // генерируем уникальный идентификатор района
    this.id = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.name = name;
    this.population = 1000;
    this.satisfaction = 50;
    this.ecology = 50;
    this.budget = 5000;
    this.strategy = strategy;
    this.neighbors = []; // соседние районы
    this.size = 1;
    this.difficulty = 'medium';
  }

  // обновляет состояние района за один ход
  update() {
    // применяем стратегию развития
    this.strategy.apply(this);
    
    // множители в зависимости от сложности игры
    const difficultyMultipliers = {
      'easy': { population: 1.3, budget: 1.3, satisfaction: 1.2, ecology: 1.2 },
      'medium': { population: 1.0, budget: 1.0, satisfaction: 1.0, ecology: 1.0 },
      'hard': { population: 0.7, budget: 0.7, satisfaction: 0.8, ecology: 0.8 }
    };
    
    const mult = difficultyMultipliers[this.difficulty] || difficultyMultipliers.medium;
    
    // рассчитываем рост населения
    const satisfactionBonus = 0.7 + (this.satisfaction / 100) * 0.6;
    const ecologyBonus = 0.8 + (this.ecology / 100) * 0.4;
    const growthRate = 0.008 * satisfactionBonus * ecologyBonus * mult.population;
    const populationGrowth = Math.floor(this.population * growthRate);
    this.population = Math.max(0, this.population + Math.max(1, populationGrowth));
    
    // рассчитываем рост бюджета
    const incomeFromPopulation = Math.floor(this.population * 0.15 * mult.budget);
    const expenseModifier = this.getExpenseModifier();
    const expenses = Math.floor(this.population * 0.12 * expenseModifier);
    let netIncome = incomeFromPopulation - expenses;
    const randomFactor = 0.5 + Math.random() * 1.0;
    netIncome = Math.floor(netIncome * randomFactor);
    this.budget = Math.max(0, this.budget + netIncome);
    
    // штраф за слишком большой бюджет
    if (this.budget > 8000) {
      const taxRate = this.difficulty === 'hard' ? 0.08 : 
                      this.difficulty === 'medium' ? 0.05 : 0.03;
      const tax = Math.floor((this.budget - 8000) * taxRate);
      this.budget = Math.max(8000, this.budget - tax);
    }
    
    // влияние соседних районов на удовлетворённость
    if (this.neighbors && this.neighbors.length > 0) {
      const avgNeighborSatisfaction = this.neighbors.reduce((sum, n) => sum + n.satisfaction, 0) / this.neighbors.length;
      this.satisfaction = this.satisfaction * 0.85 + avgNeighborSatisfaction * 0.15;
    }
    
    // ограничиваем значения допустимыми пределами
    this.satisfaction = Math.min(100, Math.max(0, Math.round(this.satisfaction)));
    this.ecology = Math.min(100, Math.max(0, Math.round(this.ecology)));
    this.budget = Math.max(0, Math.round(this.budget));
  }

  // возвращает коэффициент расходов в зависимости от типа района
  getExpenseModifier() {
    const type = this.getType();
    switch (type) {
      case 'Жилой': return 1.2;
      case 'Промышленный': return 1.0;
      case 'Коммерческий': return 0.9;
      case 'Зелёная зона': return 0.7;
      default: return 1.0;
    }
  }

  // абстрактный метод для получения типа района
  getType() {
    throw new Error('Метод getType() должен быть переопределён');
  }
}
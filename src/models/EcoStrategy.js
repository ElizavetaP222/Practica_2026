import { IStrategy } from './IStrategy';
import { GreenZone } from './GreenZone';

export class EcoStrategy extends IStrategy {
  constructor() {
    super();
    // случайная эффективность стратегии от 0.7 до 1.3
    this.efficiency = 0.7 + Math.random() * 0.6;
    // счётчик сколько раз применялась стратегия
    this.turnsApplied = 0;
  }

  apply(district) {
    // увеличиваем счётчик применений
    this.turnsApplied++;
    
    // эффективность падает каждые 10 ходов
    let efficiencyMultiplier = 1.0;
    if (this.turnsApplied > 0 && this.turnsApplied % 10 === 0) {
      efficiencyMultiplier = Math.max(0.6, 1.0 - Math.floor(this.turnsApplied / 10) * 0.1);
    }
    
    const currentEfficiency = this.efficiency * efficiencyMultiplier;
    // проверяем, является ли район зелёной зоной
    const isGreen = district instanceof GreenZone;
    // зелёные зоны получают бонус
    const bonus = isGreen ? 1.5 : 1.0;
    
    // рассчитываем изменение экологии
    let ecoChange = 6 * currentEfficiency * bonus;
    // замедляем рост если экология уже высокая
    if (district.ecology > 75) ecoChange = ecoChange * 0.6;
    // ускоряем рост если экология низкая
    if (district.ecology < 30) ecoChange = ecoChange * 1.3;
    district.ecology = Math.min(100, district.ecology + Math.floor(ecoChange));
    
    // удовлетворённость зависит от экологии и бюджета
    const satisfactionFromEcology = district.ecology * 0.5;
    const satisfactionFromBudget = Math.min(20, district.budget / 10000 * 20);
    district.satisfaction = Math.min(100, Math.floor(satisfactionFromEcology + satisfactionFromBudget + 25));
    
    // траты на экологию
    const cost = Math.floor((80 + Math.random() * 120) * (isGreen ? 0.5 : 1.0));
    district.budget = Math.max(0, district.budget - cost);
    
    // экология привлекает новых жителей
    if (district.ecology > 50 && Math.random() < 0.15) {
      const popBonus = Math.floor(10 + Math.random() * 20) * bonus;
      district.population += popBonus;
    }
    
    // зелёные зоны улучшают экологию соседей
    if (isGreen && district.neighbors && district.neighbors.length > 0) {
      district.neighbors.forEach(neighbor => {
        if (neighbor.ecology < 65) {
          neighbor.ecology = Math.min(65, neighbor.ecology + 3);
        }
      });
    }
  }
}
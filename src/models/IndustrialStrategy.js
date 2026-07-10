import { IStrategy } from './IStrategy';
import { IndustrialDistrict } from './IndustrialDistrict';

export class IndustrialStrategy extends IStrategy {
  constructor() {
    super();
    // случайная производительность от 0.6 до 1.4
    this.productivity = 0.6 + Math.random() * 0.8;
    // счётчик сколько раз применялась стратегия
    this.turnsApplied = 0;
  }

  apply(district) {
    // увеличиваем счётчик применений
    this.turnsApplied++;
    
    // эффективность падает каждые 12 ходов
    let efficiencyMultiplier = 1.0;
    if (this.turnsApplied > 0 && this.turnsApplied % 12 === 0) {
      efficiencyMultiplier = Math.max(0.5, 1.0 - Math.floor(this.turnsApplied / 12) * 0.1);
    }
    
    const currentProductivity = this.productivity * efficiencyMultiplier;
    // проверяем, является ли район промышленным
    const isIndustrial = district instanceof IndustrialDistrict;
    // промышленные районы получают бонус
    const bonus = isIndustrial ? 1.4 : 1.0;
    
    // небольшой рост бюджета
    const incomeBonus = Math.floor((20 + Math.random() * 60) * currentProductivity * bonus);
    district.budget += incomeBonus;
    
    // ухудшение экологии из-за производства
    let ecoChange = -6 * (isIndustrial ? 1.3 : 0.7);
    // замедляем ухудшение если экология уже низкая
    if (district.ecology < 25) ecoChange = ecoChange * 0.6;
    // ускоряем ухудшение если экология высокая
    if (district.ecology > 60) ecoChange = ecoChange * 1.3;
    district.ecology = Math.max(0, district.ecology + Math.floor(ecoChange));
    
    // удовлетворённость зависит от экологии и бюджета
    const satisfactionFromEcology = district.ecology * 0.4;
    const satisfactionFromBudget = Math.min(25, district.budget / 8000 * 25);
    // промышленные районы получают штраф к удовлетворённости
    const industrialPenalty = isIndustrial ? -5 : 0;
    district.satisfaction = Math.min(100, Math.max(0, Math.floor(satisfactionFromEcology + satisfactionFromBudget + 20 + industrialPenalty)));
    
    // возможные происшествия на производстве
    if (Math.random() < 0.04) {
      // авария на заводе
      district.budget = Math.max(0, district.budget - Math.floor(300 + Math.random() * 700));
      district.ecology = Math.max(0, district.ecology - 10);
      district.satisfaction = Math.max(0, district.satisfaction - 8);
    }
    
    // промышленность привлекает рабочих
    if (Math.random() < 0.1) {
      const popBonus = Math.floor(5 + Math.random() * 20) * (isIndustrial ? 1.3 : 0.8);
      district.population += popBonus;
    }
  }
}
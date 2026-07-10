import { IStrategy } from './IStrategy';
import { CommercialDistrict } from './CommercialDistrict';

export class InnovationStrategy extends IStrategy {
  constructor() {
    super();
    // случайный уровень инноваций от 0.5 до 1.3
    this.innovationLevel = 0.5 + Math.random() * 0.8;
    // счётчик сколько раз применялась стратегия
    this.turnsApplied = 0;
  }

  apply(district) {
    // увеличиваем счётчик применений
    this.turnsApplied++;
    
    // эффективность падает каждые 8 ходов
    let efficiencyMultiplier = 1.0;
    if (this.turnsApplied > 0 && this.turnsApplied % 8 === 0) {
      efficiencyMultiplier = Math.max(0.5, 1.0 - Math.floor(this.turnsApplied / 8) * 0.1);
    }
    
    const currentInnovation = this.innovationLevel * efficiencyMultiplier;
    // проверяем, является ли район коммерческим
    const isCommercial = district instanceof CommercialDistrict;
    // коммерческие районы получают бонус
    const bonus = isCommercial ? 1.4 : 1.0;
    
    // инвестиции в инновации
    const investment = Math.min(district.budget * 0.02, 150);
    district.budget -= investment;
    
    // эффект от инвестиций
    const effect = Math.floor((investment / 50) * 15 * currentInnovation * bonus);
    const income = Math.floor(effect * 0.4);
    district.budget += income;
    
    // инновации могут влиять на экологию
    const ecoChange = Math.floor((Math.random() * 4 - 1) * currentInnovation * bonus);
    district.ecology = Math.min(100, Math.max(0, district.ecology + ecoChange));
    
    // удовлетворённость от инноваций
    const satisfactionFromEcology = district.ecology * 0.45;
    const satisfactionFromBudget = Math.min(20, district.budget / 10000 * 20);
    const innovationBonus = Math.min(6, Math.floor(effect / 50));
    district.satisfaction = Math.min(100, Math.floor(satisfactionFromEcology + satisfactionFromBudget + 20 + innovationBonus));
    
    // возможный технологический прорыв
    if (Math.random() < 0.05) {
      const breakthrough = Math.floor(300 + Math.random() * 700);
      district.budget += breakthrough;
      district.satisfaction = Math.min(100, district.satisfaction + 10);
      district.ecology = Math.min(100, district.ecology + 5);
      // повышаем уровень инноваций
      this.innovationLevel = Math.min(2.0, this.innovationLevel * 1.1);
    }
    
    // инновации привлекают людей
    if (Math.random() < 0.08) {
      district.population += Math.floor(10 + Math.random() * 25) * bonus;
    }
  }
}
import { IStrategy } from './IStrategy';
import { GreenZone } from './GreenZone';
import { CommercialDistrict } from './CommercialDistrict';

export class TourismStrategy extends IStrategy {
  constructor() {
    super();
    // случайная популярность от 0.4 до 1.2
    this.popularity = 0.4 + Math.random() * 0.8;
    // счётчик сколько раз применялась стратегия
    this.turnsApplied = 0;
    // счётчик для смены сезонов
    this.season = 0;
  }

  apply(district) {
    // увеличиваем счётчик применений
    this.turnsApplied++;
    // меняем сезон (0-лето, 1-осень, 2-зима, 3-весна)
    this.season = (this.season + 1) % 4;
    
    // эффективность падает каждые 15 ходов
    let efficiencyMultiplier = 1.0;
    if (this.turnsApplied > 0 && this.turnsApplied % 15 === 0) {
      efficiencyMultiplier = Math.max(0.5, 1.0 - Math.floor(this.turnsApplied / 15) * 0.1);
    }
    
    const currentPopularity = this.popularity * efficiencyMultiplier;
    // проверяем типы районов для бонусов
    const isGreen = district instanceof GreenZone;
    const isCommercial = district instanceof CommercialDistrict;
    const bonus = isGreen ? 1.4 : isCommercial ? 1.2 : 1.0;
    
    // сезонный множитель для дохода
    let seasonMultiplier = 1.0;
    if (this.season === 0) seasonMultiplier = 1.3; // лето
    else if (this.season === 1) seasonMultiplier = 0.8; // осень
    else if (this.season === 2) seasonMultiplier = 0.5; // зима
    else if (this.season === 3) seasonMultiplier = 1.2; // весна
    
    // небольшой доход от туризма
    const income = Math.floor((40 + Math.random() * 100) * currentPopularity * bonus * seasonMultiplier);
    district.budget += income;
    
    // туризм ухудшает экологию
    const ecoChange = -Math.floor((2 + Math.random() * 4) * (isGreen ? 0.5 : 1.0));
    district.ecology = Math.max(0, district.ecology + ecoChange);
    
    // удовлетворённость от туризма
    const satisfactionFromEcology = district.ecology * 0.4;
    const satisfactionFromBudget = Math.min(20, district.budget / 10000 * 20);
    const tourismBonus = Math.min(6, Math.floor(currentPopularity * 5));
    district.satisfaction = Math.min(100, Math.floor(satisfactionFromEcology + satisfactionFromBudget + 20 + tourismBonus));
    
    // туризм слабо влияет на население
    if (Math.random() < 0.04) {
      district.population += Math.floor(2 + Math.random() * 6);
    }
  }
}
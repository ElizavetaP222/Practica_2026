import { GameEvent } from './GameEvent';

export class TechnologicalBreakthroughEvent extends GameEvent {
  description = 'Технологический прорыв: удовлетворённость и бюджет растут';

  apply(districts) {
    districts.forEach(d => {
      d.satisfaction = Math.min(100, d.satisfaction + 10);
      d.budget += 500;
    });
  }
}
import { EconomicCrisisEvent } from '../models/EconomicCrisisEvent';
import { NaturalDisasterEvent } from '../models/NaturalDisasterEvent';
import { TechnologicalBreakthroughEvent } from '../models/TechnologicalBreakthroughEvent';

export function generateRandomEvent(districts) {
  const events = [];
  const chance = Math.random();

  if (chance < 0.3) {
    const eventType = Math.random();
    if (eventType < 0.33) {
      events.push(new EconomicCrisisEvent());
    } else if (eventType < 0.66) {
      events.push(new NaturalDisasterEvent());
    } else {
      events.push(new TechnologicalBreakthroughEvent());
    }
  }
  return events;
}
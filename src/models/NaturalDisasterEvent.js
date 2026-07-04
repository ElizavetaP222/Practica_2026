import { GameEvent } from './GameEvent';

export class NaturalDisasterEvent extends GameEvent {
  description = 'Природное бедствие: население сокращено на 10%';

  apply(districts) {
    districts.forEach(d => {
      d.population = Math.floor(d.population * 0.9);
    });
  }
}
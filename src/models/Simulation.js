import { District } from './District';
import { GameEvent } from './GameEvent';
import { Logger } from './Logger';
import { generateRandomEvent } from '../utils/eventGenerator';

export class Simulation {
  constructor() {
    this.districts = [];
    this.turn = 0;
    this.logger = new Logger();
  }

  nextTurn() {
    this.turn++;
    this.districts.forEach(d => d.update());
    const events = generateRandomEvent(this.districts);
    const eventMessages = [];
    events.forEach(event => {
      event.apply(this.districts);
      const msg = `Ход ${this.turn}: ${event.description}`;
      this.logger.log(msg);
      eventMessages.push(msg);
    });
    return eventMessages;
  }
}
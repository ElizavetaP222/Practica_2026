import { District } from './District';
export class GreenZone extends District {
  constructor(name, strategy) {
    super(name, strategy);
    this.greenArea = 20;
  }
  getType() { return 'Зелёная зона'; }
}
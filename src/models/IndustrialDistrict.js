import { District } from './District';

export class IndustrialDistrict extends District {
  constructor(name, strategy) {
    super(name, strategy);
    this.pollutionLevel = 30;
  }

  getType() {
    return 'Промышленный';
  }
}
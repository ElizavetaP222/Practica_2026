import { District } from './District';
export class ResidentialDistrict extends District {
  constructor(name, strategy) {
    super(name, strategy);
    this.density = 100;
  }
  getType() { return 'Жилой'; }
}
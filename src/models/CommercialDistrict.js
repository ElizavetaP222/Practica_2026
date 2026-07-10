import { District } from './District';

export class CommercialDistrict extends District {
  constructor(name, strategy) {
    super(name, strategy);
    this.numberOfStores = 10;
  }

  getType() {
    return 'Коммерческий';
  }
}
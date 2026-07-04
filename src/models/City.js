import { Simulation } from './Simulation';

export class City {
  static instance = null;

  constructor() {
    if (City.instance) {
      return City.instance;
    }
    this.simulation = new Simulation();
    City.instance = this;
  }

  static getInstance() {
    if (!City.instance) {
      new City(); // вызовет конструктор и создаст экземпляр
    }
    return City.instance;
  }
}
// src/models/Simulation.js
import { District } from './District';
import { Logger } from './Logger';
import { generateRandomEvent } from '../utils/eventGenerator';

export class Simulation {
  constructor(config = {}) {
    // список всех районов в симуляции
    this.districts = [];
    // текущий номер хода
    this.turn = 0;
    // логгер для записи событий
    this.logger = new Logger();
    // сложность игры из настроек
    this.difficulty = config.difficulty || 'medium';
    // частота событий из настроек
    this.frequency = config.eventFrequency || 'medium';
  }

  // выполняет один ход симуляции
  nextTurn() {
    // увеличиваем счётчик ходов
    this.turn++;

    // обновляем все районы
    this.districts.forEach(d => d.update());

    // генерируем случайные события с учётом сложности и частоты
    const events = generateRandomEvent(this.districts, this.difficulty, this.frequency);

    // применяем события и собираем сообщения для лога
    const eventMessages = [];
    events.forEach(event => {
      event.apply(this.districts);
      const msg = `Ход ${this.turn}: ${event.description}`;
      this.logger.log(msg);
      eventMessages.push(msg);
    });

    // проверяем, не исчезли ли районы
    const disappeared = this.districts.filter(d => d.population <= 0);
    if (disappeared.length > 0) {
      disappeared.forEach(d => {
        const msg = `Ход ${this.turn}: Район "${d.name}" исчез (население = 0)`;
        this.logger.log(msg);
        eventMessages.push(msg);
      });
      // удаляем исчезнувшие районы из списка
      this.districts = this.districts.filter(d => d.population > 0);
    }

    // возвращаем сообщения о событиях для отображения в интерфейсе
    return eventMessages;
  }
}
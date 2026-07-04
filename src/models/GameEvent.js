export class GameEvent {
  description = 'Событие';

  apply(districts) {
    throw new Error('Метод apply() должен быть переопределён');
  }
}
export class IStrategy {
  apply(district) {
    throw new Error('Метод apply() должен быть переопределён в дочернем классе');
  }
}
import { District } from './District';
import { IStrategy } from './IStrategy';

export class IndustrialStrategy implements IStrategy {
  apply(district: District): void {
    // Увеличиваем бюджет за счёт производства, но ухудшаем экологию
    district.budget += 300;
    district.ecology = Math.max(0, district.ecology - 4);
    district.satisfaction -= 2; // жителям не нравится загрязнение
  }
}
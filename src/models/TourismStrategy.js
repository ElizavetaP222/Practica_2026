import { IStrategy } from './IStrategy';
import { District } from './District';

export class TourismStrategy implements IStrategy {
    apply(district: District): void {
    district.budget += 600; // Туризм приносит большой доход 
    district.satisfaction = Math.min(100, district.satisfaction + 8); // Жители довольны развитием инфраструктуры и сервисов
    district.ecology = Math.max(0, district.ecology - 5); // Экология ухудшается из-за большого потока туристов
  }
}
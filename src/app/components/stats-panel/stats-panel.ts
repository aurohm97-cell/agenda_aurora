import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.html',
  styleUrls: ['./stats-panel.css']
})
export class StatsPanelComponent {
  @Input() totalTareas: number = 0;
  @Input() pendientes: number = 0;
  @Input() enProceso: number = 0;
  @Input() hechas: number = 0;
  @Input() urgentes: number = 0;

  get dashArrayHechas(): string {
    if (this.totalTareas === 0) return '0 219.9';
    return (this.hechas / this.totalTareas) * 219.9 + ' 219.9';
  }

  get dashArrayProceso(): string {
    if (this.totalTareas === 0) return '0 219.9';
    return (this.enProceso / this.totalTareas) * 219.9 + ' 219.9';
  }

  get dashOffsetProceso(): number {
    if (this.hechas > 0) {
      return -((this.hechas / this.totalTareas) * 219.9) + 54.97;
    }
    return 54.97;
  }
}
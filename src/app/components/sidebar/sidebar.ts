import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  animations: [
    trigger('modalEntrada', [
    transition(':enter', [
         style({ opacity: 0, transform: 'scale(0.92)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
       ]),
       transition(':leave', [
         animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.92)' }))
       ])
     ])
   ]
})

export class SidebarComponent {
  @Output() logoutClick = new EventEmitter<void>();
   @Output() papeleraClick = new EventEmitter<void>();
  @Output() eliminarCuentaClick = new EventEmitter<string>();

  mostrandoModalPerfil = false;
  mostrandoModalEliminar = false;

  abrirPerfil() {
    this.mostrandoModalPerfil = true;
  }

  cerrarPerfil() {
    this.mostrandoModalPerfil = false;
  }

  abrirEliminarCuenta() {
    this.mostrandoModalEliminar = true;
  }

  cerrarEliminarCuenta() {
    this.mostrandoModalEliminar = false;
  }

  confirmarEliminarCuenta() {
    this.mostrandoModalEliminar = false;
    this.eliminarCuentaClick.emit();
  }
}
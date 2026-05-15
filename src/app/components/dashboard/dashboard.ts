import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  misTareas: any[] = [];
  tareaEnEdicion: number | null = null;
  tituloTemporal: string = '';
  descripcionTemporal: string = '';
  prioridadTemporal: string = 'normal';

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Al cargar la pantalla, leemos las tareas del localStorage
    this.misTareas = this.taskService.getTareas();
  }

  agregarNueva() {
    const titulo = prompt('¿Qué tienes que hacer?');
    if (titulo) {
      this.misTareas = this.taskService.agregarTarea(titulo);
    }
  }

  moverTarea(id: number, nuevoEstado: string) {
    this.misTareas = this.taskService.actualizarEstado(id, nuevoEstado);
  }

  editar(tarea: any) {
    this.tareaEnEdicion = tarea.id;
    this.tituloTemporal = tarea.titulo;
    this.descripcionTemporal = tarea.descripcion || '';
    this.prioridadTemporal = tarea.prioridad || 'normal';
  }

  guardarEdicion(id: number) {
    if (this.tituloTemporal.trim() !== '') {
      this.misTareas = this.taskService.editarTarea(
        id,
        this.tituloTemporal,
        this.descripcionTemporal,
        this.prioridadTemporal,
      );

      this.tareaEnEdicion = null; // Salimos del modo edición
    }
  }

  // Al pulsar la X ❌
  cancelarEdicion() {
    this.tareaEnEdicion = null;
    this.tituloTemporal = '';
    this.descripcionTemporal = '';
    this.prioridadTemporal = 'normal';
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres borrarla?')) {
      this.misTareas = this.taskService.borrarTarea(id);
    }
  }

  logout() {
    if (confirm('¿Quieres cerrar sesión?')) {
      // Aquí podrías borrar el token si usáramos uno,
      // por ahora simplemente volvemos al login
      this.router.navigate(['/login']);
    }
  }
}

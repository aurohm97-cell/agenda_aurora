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
  tareaABorrar: number | null = null;
  mostrandoFormularioNueva: boolean = false;
  nuevoTitulo: string = '';
  nuevaDescripcion: string = '';
  nuevaPrioridad: string = 'normal';
  mostrandoModalLogout: boolean = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Al cargar la pantalla, leemos las tareas del localStorage
    this.misTareas = this.taskService.getTareas();
  }

  // Al pulsar "+ Añadir tarea", en vez de un prompt, abrimos el formulario inline
  agregarNueva() {
    this.mostrandoFormularioNueva = true;
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaPrioridad = 'normal';
  }

  // Al pulsar el botón de ✅ Crear
  guardarNueva() {
    if (this.nuevoTitulo.trim() !== '') {
      this.misTareas = this.taskService.agregarTarea(
        this.nuevoTitulo,
        this.nuevaDescripcion,
        this.nuevaPrioridad
      );
      this.cancelarNueva(); // Reseteamos y cerramos el formulario
    }
  }

  // Al pulsar la X ❌
  cancelarNueva() {
    this.mostrandoFormularioNueva = false;
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaPrioridad = 'normal';
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
    this.tareaABorrar = id;
  }
  confirmarBorrado() {
    if (this.tareaABorrar !== null) {
      this.misTareas = this.taskService.borrarTarea(this.tareaABorrar);
      this.tareaABorrar = null; // Cerramos el modal
    }
  }
  cancelarBorrado() {
    this.tareaABorrar = null; // Cerramos el modal sin borrar
  }

  logout() {
    this.mostrandoModalLogout = true; // Abrimos el modal en lugar del confirm
  }

  confirmarLogout() {
    this.mostrandoModalLogout = false;
    this.router.navigate(['/login']); // Redirigimos al login
  }

  cancelarLogout() {
    this.mostrandoModalLogout = false; // Cerramos sin hacer nada
  }
}

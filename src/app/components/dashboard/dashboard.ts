import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  misTareas: any[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

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

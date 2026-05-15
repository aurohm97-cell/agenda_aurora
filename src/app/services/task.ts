import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly DB_NAME = 'tareas_agenda';

  constructor() {}

  // Obtener tareas
  getTareas(): any[] {
    const data = localStorage.getItem(this.DB_NAME);
    return data ? JSON.parse(data) : [];
  }

  // Guardar una nueva tarea
  agregarTarea(titulo: string) {
    const tareas = this.getTareas();
    const nueva = {
      id: Date.now(), // Usamos la fecha como ID único
      titulo: titulo,
      estado: 'pendiente' // Por defecto todas empiezan en "Por hacer"
    };
    tareas.push(nueva);
    localStorage.setItem(this.DB_NAME, JSON.stringify(tareas));
    return tareas;
  }

// Update del CRUD: Cambiar el estado (pendiente -> proceso -> hecho)
  actualizarEstado(id: number, nuevoEstado: string) {
    let tareas = this.getTareas();
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
      tareas[index].estado = nuevoEstado;
      localStorage.setItem(this.DB_NAME, JSON.stringify(tareas));
    }
    return tareas;
  }
// Update: Cambiar el texto de la tarea
  editarTarea(id: number, nuevoTitulo: string) {
    let tareas = this.getTareas();
    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
      tareas[index].titulo = nuevoTitulo;
      localStorage.setItem(this.DB_NAME, JSON.stringify(tareas));
    }
    return tareas;
  }

  // Borrar tarea (Parte del CRUD)
  borrarTarea(id: number) {
    let tareas = this.getTareas();
    tareas = tareas.filter(t => t.id !== id);
    localStorage.setItem(this.DB_NAME, JSON.stringify(tareas));
    return tareas;
  }
}
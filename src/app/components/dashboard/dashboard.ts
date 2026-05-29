import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  misTareas: any[] = [];
  tareaEnEdicion: string | null = null;
  tituloTemporal: string = '';
  descripcionTemporal: string = '';
  prioridadTemporal: string = 'normal';
  tareaABorrar: string | null = null;
  mostrandoFormularioNueva = false;
  nuevoTitulo = '';
  nuevaDescripcion = '';
  nuevaPrioridad = 'normal';
  mostrandoModalLogout = false;
  usuarioNombre = '';
  usuarioRol = ''; // Opcional, por si quieres mostrar su rol

  private mouseX = 50;
  private mouseY = 50;
  private targetX = 50;
  private targetY = 50;
  private animFrameId = 0;

  get tareasPendientes() {
    return this.misTareas.filter((t) => t.estado === 'pendiente');
  }
  get tareasEnProceso() {
    return this.misTareas.filter((t) => t.estado === 'proceso');
  }
  get tareasHechas() {
    return this.misTareas.filter((t) => t.estado === 'hecho');
  }
  get tareasUrgentes() {
    return this.misTareas.filter((t) => t.prioridad === 'urgente').length;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const container = document.querySelector('.dashboard-container') as HTMLElement | null;
    if (container) {
      const rect = container.getBoundingClientRect();
      this.targetX = (event.clientX - rect.left) / rect.width * 100;
      this.targetY = (event.clientY - rect.top) / rect.height * 100;
    }
  }
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    // Al cargar la pantalla, leemos las tareas
    this.misTareas = await this.taskService.getTareas();

  const datos = await this.authService.getDatosUsuario();
    if (datos) {
      this.usuarioNombre = datos.nombre;
      this.usuarioRol = datos.rol;
    } else {
      // Si no hay usuario autenticado, redirigimos al login
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.animarGradiente();
  }

  private animarGradiente(): void {
    this.mouseX += (this.targetX - this.mouseX) * 1.0;
    this.mouseY += (this.targetY - this.mouseY) * 1.0;

    const container = document.querySelector('.dashboard-container') as HTMLElement | null;
    if (container) {
      container.style.backgroundImage = `
        radial-gradient(circle at ${this.mouseX}% ${this.mouseY}%,
          rgba(190, 145, 190, 0.65) 0.5%,
          rgba(212, 235, 214, 0.3) 5%,
          rgba(250, 250, 248, 0) 5%),
        linear-gradient(135deg, #fafaf8 0%, #d4ebd6 100%)
      `;
    }
 this.animFrameId = requestAnimationFrame(() => this.animarGradiente());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }

  // Al pulsar "+ Añadir tarea", en vez de un prompt, abrimos el formulario inline
  agregarNueva() {
    this.mostrandoFormularioNueva = true;
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaPrioridad = 'normal';
  }

  // Al pulsar el botón de ✅ Crear
  async guardarNueva() {
    if (this.nuevoTitulo.trim() !== '') {
      this.misTareas = await this.taskService.agregarTarea(
        this.nuevoTitulo,
        this.nuevaDescripcion,
        this.nuevaPrioridad,
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

  async moverTarea(id: string, nuevoEstado: string) {
    this.misTareas = await this.taskService.actualizarEstado(id, nuevoEstado);
  }

  async onDrop(event: CdkDragDrop<any[]>, nuevoEstado: string) {
    if (event.previousContainer !== event.container) {
      const tarea = event.previousContainer.data[event.previousIndex];
      this.misTareas = await this.taskService.actualizarEstado(tarea.id, nuevoEstado);
    }
  }

  editar(tarea: any) {
    this.tareaEnEdicion = tarea.id;
    this.tituloTemporal = tarea.titulo;
    this.descripcionTemporal = tarea.descripcion || '';
    this.prioridadTemporal = tarea.prioridad || 'normal';
  }

  async guardarEdicion(id: string) {
    if (this.tituloTemporal.trim() !== '') {
      this.misTareas = await this.taskService.editarTarea(
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

  eliminar(id: string) {
    this.tareaABorrar = id;
  }

  async confirmarBorrado() {
    if (this.tareaABorrar !== null) {
      this.misTareas = await this.taskService.borrarTarea(this.tareaABorrar);
      this.tareaABorrar = null; // Cerramos el modal
    }
  }

  cancelarBorrado() {
    this.tareaABorrar = null; // Cerramos el modal sin borrar
  }

  logout() {
    this.mostrandoModalLogout = true; // Abrimos el modal en lugar del confirm
  }

  async confirmarLogout() {
    this.mostrandoModalLogout = false;
    await this.authService.logout(); // Cerramos sesión
    this.router.navigate(['/login']); // Redirigimos al login
  }

  cancelarLogout() {
    this.mostrandoModalLogout = false; // Cerramos sin hacer nada
  }
  }


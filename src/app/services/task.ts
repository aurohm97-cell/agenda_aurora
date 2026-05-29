import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Obtener el uid del usuario actual
  private getUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Obtener tareas del usuario actual
  async getTareas(): Promise<any[]> {
    const uid = this.getUid();
    if (!uid) return [];

    const tareasRef = collection(this.firestore, 'tareas');
    const q = query(tareasRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(d => ({
      id: d.id,  // ID del documento de Firestore
      ...d.data()
    }));
  }

  // Añadir tarea nueva
  async agregarTarea(titulo: string, descripcion: string = '', prioridad: string = 'normal'): Promise<any[]> {
    const uid = this.getUid();
    if (!uid) return [];

    const tareasRef = collection(this.firestore, 'tareas');
    await addDoc(tareasRef, {
      uid,
      titulo,
      descripcion,
      prioridad,
      estado: 'pendiente'
    });

    return this.getTareas();
  }

  // Actualizar estado (mover entre columnas)
  async actualizarEstado(id: string, nuevoEstado: string): Promise<any[]> {
    const tareaRef = doc(this.firestore, 'tareas', id);
    await updateDoc(tareaRef, { estado: nuevoEstado });
    return this.getTareas();
  }

  // Editar título, descripción y prioridad
  async editarTarea(id: string, titulo: string, descripcion: string, prioridad: string): Promise<any[]> {
    const tareaRef = doc(this.firestore, 'tareas', id);
    await updateDoc(tareaRef, { titulo, descripcion, prioridad });
    return this.getTareas();
  }

  // Borrar tarea
  async borrarTarea(id: string): Promise<any[]> {
    const tareaRef = doc(this.firestore, 'tareas', id);
    await deleteDoc(tareaRef);
    return this.getTareas();
  }
}
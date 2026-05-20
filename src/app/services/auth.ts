import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
  })
export class AuthService {
  // Inyectamos la base de datos de Firebase
  private firestore = inject(Firestore);
  private usuariosCollection = collection(this.firestore, 'usuarios');

  constructor() {}

  // 1. Guardar un usuario nuevo en la nube (Registro)
  async registrar(nombre: string, email: string, password: string, rol: string = 'Usuario'): Promise<boolean> {
    // Comprobamos si el email ya existe en Firebase
    const q = query(this.usuariosCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return false; // El email ya está registrado
    }

    // Guardamos el nuevo usuario en la colección de la nube
    await addDoc(this.usuariosCollection, { nombre, email, password, rol });
    return true;
  }

  // 2. Comprobar credenciales en la nube (Login)
  async login(email: string, pass: string): Promise<boolean> {
    const q = query(this.usuariosCollection, where('email', '==', email), where('password', '==', pass));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty; // Devuelve true si encuentra coincidencia
  }
}
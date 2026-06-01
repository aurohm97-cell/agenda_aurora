import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Usuario actual como observable
  usuario$ = user(this.auth);

  // Registro — crea el usuario en Firebase Auth y guarda nombre/rol en Firestore
  async registrar(nombre: string, email: string, password: string, rol: string = 'Usuario'): Promise<string> {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = credencial.user.uid;

      // Guardamos nombre y rol en Firestore usando el uid como ID de documento
      await setDoc(doc(this.firestore, 'usuarios', uid), {
        nombre,
        email,
        rol
        // sin password — Firebase Auth la gestiona de forma segura
      }); 
      return 'ok';
    } catch (error: any) {
if (error.code === 'auth/email-already-in-use') return 'email-en-uso';
    if (error.code === 'auth/invalid-email') return 'email-invalido';
    if (error.code === 'auth/weak-password') return 'password-debil';
    return 'error';
    }
  }

  // Login — Firebase Auth comprueba las credenciales
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  // Obtener datos del usuario actual desde Firestore
  async getDatosUsuario(): Promise<{ nombre: string, rol: string } | null> {
    const usuarioActual = this.auth.currentUser;
    if (!usuarioActual) return null;

    const docRef = doc(this.firestore, 'usuarios', usuarioActual.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        nombre: data['nombre'],
        rol: data['rol']
      };
    }
    return null;
  }

  // Obtener uid del usuario actual
  getUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
get authInstance() {
    return this.auth;
  }
}

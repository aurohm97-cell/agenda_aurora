import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where, writeBatch } from '@angular/fire/firestore';

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

  async eliminarCuenta(password: string): Promise<void> {
  const usuarioActual = this.auth.currentUser;
  if (!usuarioActual || !usuarioActual.email) return;

  const uid = usuarioActual.uid;

  // 0. Reautenticar — Firebase lo exige para operaciones sensibles
  const credencial = EmailAuthProvider.credential(usuarioActual.email, password);
  await reauthenticateWithCredential(usuarioActual, credencial);

  // 1. Borrar todas las tareas del usuario en lote
  const tareasRef = collection(this.firestore, 'tareas');
  const q = query(tareasRef, where('uid', '==', uid));
  const snapshot = await getDocs(q);

  const batch = writeBatch(this.firestore);
  snapshot.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();

  // 2. Borrar documento del usuario en Firestore
  await deleteDoc(doc(this.firestore, 'usuarios', uid));

  // 3. Borrar cuenta de Firebase Auth — siempre el último paso
  await deleteUser(usuarioActual);
  }
}

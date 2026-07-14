import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export const usuarioResolver: ResolveFn<{ nombre: string, rol: string } | null> = async () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);

  const user = await firstValueFrom(authState(auth));
  if (!user) return null;

  const docRef = doc(firestore, 'usuarios', user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      nombre: data['nombre'],
      rol: data['rol']
    };
  }

  return null;
};
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 🔥 Importamos las herramientas de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// 🔑 Tus credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBtm-8SPNxsD38rDljlKQj8Y5yqS7VtGU",
  authDomain: "agenda-aurora-caf9b.firebaseapp.com",
  projectId: "agenda-aurora-caf9b",
  storageBucket: "agenda-aurora-caf9b.firebasestorage.app",
  messagingSenderId: "393813414848",
  appId: "1:393813414848:web:05b9b82c8f084b56b4ee25",
  measurementId: "G-Y10WYGCQQ8"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // <-- Esto es lo tuyo y lo mantenemos
    provideRouter(routes),                // <-- Esto también es lo tuyo
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
};
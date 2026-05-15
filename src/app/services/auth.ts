import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Este será el nombre de nuestra "tabla" en el navegador
  private readonly DB_NAME = 'usuarios_agenda_aurora';

  constructor() {}

  // 1. Leer los usuarios que ya existan
  private getUsuariosLocales(): any[] {
    const data = localStorage.getItem(this.DB_NAME);
    return data ? JSON.parse(data) : [];
  }

  // 2. Guardar un usuario nuevo (Registro)
  // En el archivo auth.ts
  registrar(nombre: string, email: string, password: string): boolean {
    const usuarios = this.getUsuariosLocales();

    // Comprobamos si el email ya existe
    if (usuarios.find((u: any) => u.email === email)) {
      return false;
    }

    // Guardamos el nuevo usuario con su nombre incluido
    usuarios.push({ nombre, email, password });
    localStorage.setItem(this.DB_NAME, JSON.stringify(usuarios));
    return true;
  }

  // 3. Comprobar credenciales (Login)
  login(email: string, pass: string): boolean {
    const usuarios = this.getUsuariosLocales();
    return usuarios.some((u) => u.email === email && u.password === pass);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Este será el nombre de nuestra "tabla" en el navegador
  private readonly DB_NAME = 'usuarios_agenda_aurora';

  constructor() { }

  // 1. Leer los usuarios que ya existan
  private getUsuariosLocales(): any[] {
    const data = localStorage.getItem(this.DB_NAME);
    return data ? JSON.parse(data) : [];
  }

  // 2. Guardar un usuario nuevo (Registro)
  registrar(nuevoUsuario: any): boolean {
    const usuarios = this.getUsuariosLocales();
    
    // Si el email ya existe, devolvemos 'false' para avisar al componente
    if (usuarios.find(u => u.email === nuevoUsuario.email)) {
      return false; 
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem(this.DB_NAME, JSON.stringify(usuarios));
    return true;
  }

  // 3. Comprobar credenciales (Login)
  login(email: string, pass: string): boolean {
    const usuarios = this.getUsuariosLocales();
    return usuarios.some(u => u.email === email && u.password === pass);
  }
}
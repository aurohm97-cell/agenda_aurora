import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ruta a tu servicio corto

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
mostrandoModalExito = false;
mostrandoModalError = false;
mensajeError = '';

  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router) {}

  async onRegister() {
    if (this.registerForm.valid) {
      // 1. Extraemos los valores individuales del formulario
      const { nombre, email, password } = this.registerForm.value;

      // 2. Se los pasamos al servicio.
      // Usamos el "!" para decirle a TS que estamos seguros de que no son nulos.
      const resultado = await this.authService.registrar(nombre!, email!, password!);

      if (resultado === 'ok') {
       this.mostrandoModalExito = true;
    } else if (resultado === 'email-en-uso') {
      this.mensajeError = 'Este email ya está registrado.';
      this.mostrandoModalError = true;
    } else if (resultado === 'email-invalido') {
      this.mensajeError = 'El email no es válido.';
      this.mostrandoModalError = true;
    } else if (resultado === 'password-debil') {
      this.mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
      this.mostrandoModalError = true;
    } else {
      this.mensajeError = 'Ha ocurrido un error. Inténtalo de nuevo.';
      this.mostrandoModalError = true;
    }
  }
}

  // 2. Funciones para cerrar los modales
  cerrarModalError() {
    this.mostrandoModalError = false;
  }

  cerrarModalExito() {
    this.mostrandoModalExito = false;
    // Redirigimos al login JUSTO CUANDO el usuario acepta el modal de éxito
    this.router.navigate(['/login']); 
  }
}

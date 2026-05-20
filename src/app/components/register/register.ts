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
  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onRegister() {
    if (this.registerForm.valid) {
      // 1. Extraemos los valores individuales del formulario
      const { nombre, email, password } = this.registerForm.value;

      // 2. Se los pasamos al servicio.
      // Usamos el "!" para decirle a TS que estamos seguros de que no son nulos.
      const exito = await this.authService.registrar(nombre!, email!, password!);

      if (exito) {
        alert('¡Usuario creado con éxito! Ahora puedes loguearte.');
        this.router.navigate(['/login']);
      } else {
        alert('Este email ya está registrado.');
      }
    }
  }
}

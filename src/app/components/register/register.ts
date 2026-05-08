import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ruta a tu servicio corto

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.registerForm.valid) {
      const exito = this.authService.registrar(this.registerForm.value);
      
      if (exito) {
        alert('¡Usuario creado con éxito! Ahora puedes loguearte.');
        this.router.navigate(['/login']); // Te manda al login automáticamente
      } else {
        alert('Este email ya está registrado.');
      }
    }
  }
}
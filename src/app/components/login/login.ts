import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Añadimos Router para poder navegar
import { AuthService } from '../../services/auth'; // Importamos tu servicio corto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Inyectamos el servicio y el router en el constructor
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      // Llamamos a la función login de nuestro servicio
      const esValido = this.authService.login(email!, password!);

      if (esValido) {
        alert('¡Bienvenido de nuevo!');
        // Aquí es donde mandaremos al usuario a la "Agenda" o "Tablero Trello"
        // Por ahora lo dejaremos así hasta que creemos el siguiente componente
        // this.router.navigate(['/dashboard']); 
      } else {
        alert('Email o contraseña incorrectos. ¿Ya te has registrado?');
      }
    }
  }
}
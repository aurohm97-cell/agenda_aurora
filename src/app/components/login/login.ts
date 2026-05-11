import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Añadimos Router para poder navegar
import { AuthService } from '../../services/auth'; // Importamos tu servicio corto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // Inyectamos el servicio y el router en el constructor
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const esValido = this.authService.login(email!, password!);

      if (esValido) {
        // En lugar de solo el alert, ahora navegamos:
        this.router.navigate(['/dashboard']);
      } else {
        alert('Email o contraseña incorrectos.');
      }
    }
  }
}

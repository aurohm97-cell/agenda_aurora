import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent{
  mostrandoModalError = false;
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
    
  async onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email || '';
      const password = this.loginForm.value.password || '';

      const esValido = await this.authService.login(email, password);

      if (esValido) {
        this.router.navigate(['/dashboard']);
      } else {
        this.mostrandoModalError = true;
      }
    }
  }

  cerrarModalError() {
    this.mostrandoModalError = false;
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth'; 

// 👇 1. Importamos las herramientas de Firebase que necesitamos aquí
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  mostrandoModalError = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // 👇 2. Inyectamos 'firestore' en el constructor junto a los que ya tenías
  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore 
  ) {}

  // 👇 3. Añadimos 'async' a la función
  async onLogin() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    
    // 👇 4. Añadimos 'await' porque el servicio ahora va a internet
    const esValido = await this.authService.login(email!, password!);

    if (esValido) {
      // 👇 5. Buscamos los datos de este usuario en Firebase para la cabecera
      const usuariosCollection = collection(this.firestore, 'usuarios');
      const q = query(usuariosCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const usuarioData = querySnapshot.docs[0].data();
        
        // 💾 Guardamos su nombre y rol reales en el localStorage
        localStorage.setItem('usuarioNombre', usuarioData['nombre']);
        localStorage.setItem('usuarioRol', usuarioData['rol'] || 'Usuario');
      }

      // Navegamos al dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // 🔄 CAMBIO AQUÍ: En vez de alert, abrimos nuestro modal personalizado
      this.mostrandoModalError = true;
    }
  }
}

// 2. Añade también esta pequeña función debajo de onLogin para poder cerrar el cartel:
cerrarModalError() {
  this.mostrandoModalError = false;
}
}
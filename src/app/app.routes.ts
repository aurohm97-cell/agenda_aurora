import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register'; // Ruta corta
import { DashboardComponent } from './components/dashboard/dashboard'; // Asegúrate de que la ruta sea correcta
import { authGuard } from './guards/auth.guard';
import { usuarioResolver } from './resolvers/usuario.resolver';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
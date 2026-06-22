import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() usuarioNombre: string = '';
  @Input() usuarioRol: string = '';

  constructor(public theme: ThemeService) {}
}
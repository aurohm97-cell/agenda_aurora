import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('jaspeanteCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  mostrandoModalError = false;
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore,
  ) {}

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId = 0;
  private imageSize = 128; 
  private tempCanvas!: HTMLCanvasElement;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas);

    // 1. CREAMOS EL GRANO UNA SOLA VEZ AQUÍ (Evita que la pantalla se congele)
    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = this.imageSize;
    this.tempCanvas.height = this.imageSize;
    
    const tempCtx = this.tempCanvas.getContext('2d');
    if (tempCtx) {
      const buffer = tempCtx.createImageData(this.imageSize, this.imageSize);
      const bufferData = new Uint32Array(buffer.data.buffer);
      for (let i = 0; i < bufferData.length; i++) {
        if (Math.random() > 0.5) {
          const alpha = Math.floor(Math.random() * 14); // Opacidad del grano visible y elegante
          bufferData[i] = (alpha << 24) | 0x00000000;  // Píxeles oscuros orgánicos
        }
      }
      tempCtx.putImageData(buffer, 0, 0);
    }

    // 2. Iniciamos el bucle ultra-ligero
    this.renderJaspeado();
  }

  private resizeCanvas = (): void => {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  private renderJaspeado = (): void => {
    if (!this.ctx || !this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Solo cambiamos las coordenadas de posición, rendimiento óptimo del 100%
    const offsetX = Math.floor(Math.random() * this.imageSize);
    const offsetY = Math.floor(Math.random() * this.imageSize);

    const pattern = this.ctx.createPattern(this.tempCanvas, 'repeat');
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.save();
      this.ctx.translate(offsetX, offsetY);
      this.ctx.fillRect(-offsetX, -offsetY, canvas.width, canvas.height);
      this.ctx.restore();
    }

    this.animationFrameId = requestAnimationFrame(this.renderJaspeado);
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCanvas);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email || '';
      const password = this.loginForm.value.password || '';

      const esValido = await this.authService.login(email, password);

      if (esValido) {
        const usuariosCollection = collection(this.firestore, 'usuarios');
        const q = query(usuariosCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const usuarioData = querySnapshot.docs[0].data();
          localStorage.setItem('usuarioNombre', usuarioData['nombre']);
          localStorage.setItem('usuarioRol', usuarioData['rol'] || 'Usuario');
        }
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
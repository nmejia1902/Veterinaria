import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  correo: string = '';
  contrasenia: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  login(): void {
    this.errorMessage = '';
    this.loading = true;
    this.authService
      .login({ correo: this.correo, password: this.contrasenia })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          const token =
            (res && (res.token || (res as any).token)) ??
            localStorage.getItem('token');
          if (!token) {
            this.errorMessage =
              res?.message || 'No se recibió token del servidor';
            return;
          }
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Login error', err);
          if (err?.status === 401) {
            this.errorMessage = 'Credenciales inválidas';
          } else {
            this.errorMessage = 'Ocurrió un error. Intenta de nuevo.';
          }
        },
      });
  }
}

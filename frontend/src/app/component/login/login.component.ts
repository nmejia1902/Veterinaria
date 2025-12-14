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

  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    this.loading = true;

    if (!this.correo || !this.contrasenia) {
      this.error = 'Debe ingresar correo y contraseña';
      this.loading = false;
      return;
    }

    this.authService.login({
      correo: this.correo,
      password: this.contrasenia
    }).subscribe({
      next: () => {
        this.loading = false;

        // ✅ REDIRECCIÓN EXPLÍCITA (ESTO ERA LO QUE FALTABA)
        this.router.navigateByUrl('/venta');
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 401) {
          this.error = 'Correo o contraseña incorrectos';
        } else {
          this.error = 'Ocurrió un error. Intenta nuevamente.';
        }
      }
    });
  }
}

import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-vehiculos',
  imports: [CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent implements OnInit{
  vehiculos: any[] = [];
  errorMessage: string = '';
  constructor(private usersService: UserService) {}
  ngOnInit() {
    this.loadVehiculos();
  }

  loadVehiculos(){
    this.errorMessage = '';
    this.usersService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data.results;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);

        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }

      }
    });
  }
}

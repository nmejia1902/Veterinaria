import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  users: any[] = [];
  errorMessage: string = '';
  constructor(private usersService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.errorMessage = '';
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data.data;
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

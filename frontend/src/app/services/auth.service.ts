import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth/login';

  // 🔥 estado global de sesión
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // observable público
  get isLoggedIn$() {
    return this.loggedInSubject.asObservable();
  }

  login(data: { correo: string; password: string }) {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.loggedInSubject.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }
}

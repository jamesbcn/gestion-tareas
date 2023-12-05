import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkLocalStorageAuth());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  login(username: string, password: string): void {
    if (username === 'user' && password === 'password') {
      this.isAuthenticatedSubject.next(true);
      localStorage.setItem('gestion-tareas-token', 'true');
    }
    else {
      alert("Nombre de usuario y/o contraseña incorrectos.")
    }
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('gestion-tareas-token');
    this.router.navigate(['/login']);
  }

  private checkLocalStorageAuth(): boolean {
    const storedAuth = localStorage.getItem('gestion-tareas-token');
    return Boolean(storedAuth);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
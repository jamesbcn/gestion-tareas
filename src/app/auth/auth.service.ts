import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap  } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkLocalStorageAuth());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private baseUrl = environment.domain;

  constructor(private http: HttpClient, private router: Router) {}

  login(username:string, password:string): Observable<User> {

    return this.http.post<User>(`${this.baseUrl}/login`, {username, password})
        .pipe(
            tap(username => {
                this.isAuthenticatedSubject.next(true);
                localStorage.setItem('gestion-tareas-token', JSON.stringify(username));
            }),
            shareReplay()
        );
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
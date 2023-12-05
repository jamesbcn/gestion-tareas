import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((authenticated) => {
        if (authenticated) {
          return true; // Permitir acceso a la ruta
        } 
        else {
          // Navegar a la página de inicio de sesión si no está autenticado
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}

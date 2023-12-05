import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <router-outlet></router-outlet>
  <div *ngIf="isAuthenticated$ | async">
    <button (click)="logout()">Cerrar</button>
  </div>
  `
})
export class AppComponent {

  isAuthenticated$: Observable<boolean> = of(false); // Valor inicial de falso.

  constructor(public authService: AuthService){

    this.isAuthenticated$ = authService.isAuthenticated$;

  }

  logout(){
    this.authService.logout();
  }
}

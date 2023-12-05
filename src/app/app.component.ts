import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule],
  template: `
            <mat-toolbar color="primary">
              <span>Gestión de tareas</span>
              <span style="flex: 1 1 auto;"></span>
              <div *ngIf="isAuthenticated$ | async">
                <button (click)="logout()"><mat-icon>logout</mat-icon><span style="vertical-align: 40%"> Cerrar</span></button>
              </div>
              
            </mat-toolbar>
            <router-outlet></router-outlet>
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

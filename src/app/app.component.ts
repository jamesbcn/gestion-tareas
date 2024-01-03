import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { LoadingComponent } from './shared/components/loading/loading.component';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, LoadingComponent],
  template: `
            <mat-toolbar color="primary" style="position: fixed; z-index: 1000">
              <span>Gestión de tareas</span>
              <span style="flex: 1 1 auto;"></span>
              @if( isAuthenticated$ | async ){
                <button mat-raised-button (click)="logout()"><mat-icon>logout</mat-icon><span style="vertical-align: -10%"> Cerrar</span></button>
              }
            </mat-toolbar>
            <app-loading></app-loading>
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

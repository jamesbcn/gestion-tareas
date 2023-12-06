import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, AsyncPipe, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  isAuthenticated$: Observable<boolean> = of(false); // Valor inicial de falso.

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.isAuthenticated$ = authService.isAuthenticated$;
  }

  login(): void {

    // Uso de la asignación por desestructuración.
    const { username, password } = this.loginForm.value;

    // Uso de take(1) para desuscribir automáticamente después de recibir el primer valor.
    this.authService.isAuthenticated$.pipe(take(1))
    
    .subscribe( (authenticated) => {
        // Next handler (función anónima)
        if (!authenticated) {
          this.authService.login(username, password)
            .subscribe(
              /// Objeto de Observador para mantener las respuestas distintas
              {
                next: () => {
                  this.router.navigate(['/task-list']);
                },
                error: () => {
                    alert("Login failed!");
                }
              }
            );
          
        } 
        else {
          alert('Ya has iniciado sesión.');
        }

    });
  }
}
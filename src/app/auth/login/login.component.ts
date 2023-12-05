import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, AsyncPipe, ReactiveFormsModule],
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
    this.authService.isAuthenticated$.pipe(take(1)).subscribe((authenticated) => {

      if (!authenticated) {
        this.authService.login(username, password);
        this.router.navigate(['/task-list']);
      } 
      else {
        alert('Ya has iniciado sesión.');
      }

    });
  }
}
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  isAuthenticated$: Observable<boolean> = of(false); // Valor inicial de falso.

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private toastr: ToastrService,
              private loadingService: LoadingService) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.isAuthenticated$ = authService.isAuthenticated$;
  }

  login(): void {

    this.loadingService.loadingOn();

    // Uso de la asignación por desestructuración.
    const { username, password } = this.loginForm.value;

    this.authService.isAuthenticated$
    .pipe(take(1)) // Uso de take(1) para desuscribir automáticamente después de recibir el primer valor.
    .subscribe( (authenticated) => {
        // Next handler (función anónima)
        if (!authenticated) {
          this.authService.login(username, password)
            .pipe(take(1))
            .subscribe(
              /// Objeto de Observador para mantener las respuestas distintas
              {
                next: () => {
                  this.router.navigate(['/task-list']);
                  const msg = "Inicio de sesión exitoso";
                  this.toastr.success(msg);
                  
                },
                error: () => {
                  const msg = "Inicio de sesión fallido. Por favor, verifica tus credenciales.";
                  this.toastr.error(msg);

                },
                complete: () => this.loadingService.loadingOff()
                
              }
            );
          
        } 
        else {
          alert('Ya has iniciado sesión.');
        }

    });
  }
}
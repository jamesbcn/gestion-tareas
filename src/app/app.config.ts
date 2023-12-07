import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { JwtInterceptor } from './auth/jwt.interceptor';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
  ),
  {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
  },
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
]
};

import { Component } from '@angular/core';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [],
  template: `
    <div class="error-container">
      <h1>¡404 No Encontrada!</h1>
      <!-- You can customize the error message above -->
    </div>
  `,
  styles: [`
    .error-container
      display: flex
      justify-content: center
      align-items: center
      height: 100%

    h1
      color: #fff
      font-size: 150px
  `]
})
export class error404Component {

}

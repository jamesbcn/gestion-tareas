import { AsyncPipe, NgIf } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf, AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.sass'
})
export class LoadingComponent {

  constructor(public loadingService: LoadingService) {

  }

}

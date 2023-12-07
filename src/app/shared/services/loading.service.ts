import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject,of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(true);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

    loadingOn() {
      console.log("loading on")
        this.loadingSubject.next(true);

    }

    loadingOff() {
      console.log("loading off")
        this.loadingSubject.next(false);
    }

}

import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject,of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

    loadingOn() {
        this.loadingSubject.next(true);

    }

    loadingOff() {
        this.loadingSubject.next(false);
    }

}

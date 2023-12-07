// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, shareReplay } from 'rxjs';
import { Task } from '../../models/task.model';
import  { environment } from '../../../environment/environment';

interface TasksPayload {
  payload: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = environment.domain;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksPayload>(`${this.baseUrl}/tasks`)
            .pipe(
              map(response => response.payload),
              shareReplay()
            );
  }

  saveTask(id: number, task: Task): Observable<Task> {
    const url = `${this.baseUrl}/tasks/${id}`;

    return this.http.put<Task>(url, task);
  }

  deleteTask(id: number): Observable<Task> {
    const url = `${this.baseUrl}/tasks/${id}`;

    return this.http.delete<Task>(url);
  }

}

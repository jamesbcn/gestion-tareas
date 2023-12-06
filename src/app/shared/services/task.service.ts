// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Task } from '../../models/task.model';

interface TasksPayload {
  payload: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = "http://localhost:9000/api";
  private taskSavedSubject = new Subject<Task>();

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksPayload>(`${this.baseUrl}/tasks`)
            .pipe(
              map(response => response.payload)
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

  // Observable para suscribirse a eventos de modificación de tarea
  taskSaved$(): Observable<Task> {
    return this.taskSavedSubject.asObservable();
  }

  // Emitir eventos de modificación de tarea
  emitTaskSaved(task: Task) {
    this.taskSavedSubject.next(task);
  }
}

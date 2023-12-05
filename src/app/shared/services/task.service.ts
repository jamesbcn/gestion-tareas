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
  private taskModifiedSubject = new Subject<Task>();

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksPayload>(`${this.baseUrl}/tasks`)
            .pipe(
              map(response => response.payload)
            );
  }

  modifyTask(id: number, task: Task): Observable<Task> {
    const url = `${this.baseUrl}/tasks/${id}`;

    return this.http.put<Task>(url, task);
  }

  // Observable para suscribirse a eventos de modificación de tarea
  taskModified$(): Observable<Task> {
    return this.taskModifiedSubject.asObservable();
  }

  // Emitir eventos de modificación de tarea
  emitTaskModified(task: Task) {
    this.taskModifiedSubject.next(task);
  }

  generateUniqueId(tasks: Task[]): number {
    const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    return maxId + 1;
  }
}

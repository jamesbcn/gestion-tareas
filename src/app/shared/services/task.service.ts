// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../../models/task.model';

interface TasksPayload {
  payload: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksPayload>('http://localhost:9000/api/tasks')
            .pipe(
              map(response => response.payload)
            );
  }

  generateUniqueId(tasks: Task[]): number {
    const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    return maxId + 1;
  }
}

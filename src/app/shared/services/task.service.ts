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

  baseUrl = "http://localhost:9000/api";

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

}

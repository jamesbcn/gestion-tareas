import { Component, OnInit } from '@angular/core';
import { Task } from '../../../models/task.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  ngOnInit(): void {
    // Simulating an asynchronous operation to fetch tasks
    const fetchedTasks: Task[] = [
      { title: 'Tarea 1', description: 'Descripción 1', tags: ['Tag1', 'Tag2'] },
      { title: 'Tarea 2', description: 'Descripción 2', tags: ['Tag3', 'Tag4'] },
    ];

    // Emit the fetched tasks to subscribers
    this.tasksSubject.next(fetchedTasks);
  }
}

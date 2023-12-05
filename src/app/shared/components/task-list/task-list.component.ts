import { Component, OnInit } from '@angular/core';
import { Task } from '../../../models/task.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit {
  
  tasks$!: Observable<Task[]>;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    
    this.tasks$ = this.taskService.getAllTasks();
  }
}

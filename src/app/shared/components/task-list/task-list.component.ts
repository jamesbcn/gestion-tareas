import { Component, OnInit } from '@angular/core';
import { Task } from '../../../models/task.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskModifyComponent } from '../task-modify/task-modify.component';

import { MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, MatButtonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit {
  
  tasks$!: Observable<Task[]>;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    
    this.tasks$ = this.taskService.getAllTasks();
  }

  openTaskModal(task: Task, enterAnimationDuration: string, exitAnimationDuration: string): void {

    
    const dialogRef = this.dialog.open(TaskModifyComponent, {
      height: '400px',
      width: '600px',
      data: task, // Pasar la tarea como datos al modal
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}

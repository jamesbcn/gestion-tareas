import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Task } from '../../../models/task.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
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

export class TaskListComponent implements OnInit, OnDestroy {
  
  tasks$!: Observable<Task[]>;

  private taskModifiedSubscription: Subscription = new Subscription();;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    
    this.tasks$ = this.taskService.getAllTasks();

    this.taskModifiedSubscription = this.taskService.taskModified$().subscribe(
      (modifiedTask) => {
        // Manejar el evento de modificación de la tarea
        console.log('Task modified event received:', modifiedTask);

        // Actualizar la tarea única en el observable tasks$
        this.tasks$ = this.tasks$.pipe(
          map(tasks => tasks.map(task => task.id === modifiedTask.id ? modifiedTask : task))
        );

      }
    );
 
  }

  ngOnDestroy() {
    this.taskModifiedSubscription.unsubscribe();
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, of, tap } from 'rxjs';
import { Task } from '../../../models/task.model';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskSaveComponent } from '../task-save/task-save.component';
import { DeepCopyService } from '../../services/deep-copy.service';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit, OnDestroy {
  
  originalTasks: Task[] = [];
  tasks$!: Observable<Task[]>;

  tagsSelected = new FormControl('');
  tagsList: string[] = [];

  private taskSavedSubscription: Subscription = new Subscription();

  constructor(private taskService: TaskService, private dialog: MatDialog, private copyService: DeepCopyService) {}

  ngOnInit(): void {

    this.updateTasks();

    this.subscribeTagsSelected()

    this.subscribeTaskSaved()
  }

  updateTasks(){

    this.tasks$ = this.taskService.getAllTasks().pipe(
      tap(tasks => {
        this.originalTasks = tasks; // Store the original list of tasks
        const tagsAll = tasks.flatMap(task => task.tags.map(tag => tag.name));
        this.tagsList = [...new Set(tagsAll)];
        this.tagsSelected.updateValueAndValidity();
      })
    );

  }

  subscribeTagsSelected(){

    this.tagsSelected.valueChanges.subscribe(
      (values: any): void => {
  
        let arr = [...values];
        this.filterTasksByTags(arr);
      }
    );

  }

  subscribeTaskSaved(){
    this.taskSavedSubscription = this.taskService.taskSaved$().subscribe(
      (savedTask) => {
        console.log('Evento de tarea modificado se ha recibido:', savedTask);

        this.updateTasks();
        
      }
    );
  }
  

  filterTasksByTags(tags: string[]): void {
    // Filter tasks in-memory based on selected tags
    this.tasks$ = of(this.originalTasks.filter(task => tags.every((tag: any) => task.tags.some(taskTag => taskTag.name === tag))));
  }

  ngOnDestroy() {
    this.taskSavedSubscription.unsubscribe();
  }

  openTaskModal(enterAnimationDuration: string, exitAnimationDuration: string, task?: Task): void {

    // Crear una copia de la tarea para tener adento del modal.
    const taskCopy = task ? this.copyService.deepCopy(task) : {};

    const dialogRef = this.dialog.open(TaskSaveComponent, {
      height: '400px',
      width: '600px',
      data: {...taskCopy}, // Pasar una copia de la tarea para evitar actualizando los datos sin querer.
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  deleteTask(id: number) {
    console.log(id)
  }

}

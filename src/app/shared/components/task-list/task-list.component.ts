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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit, OnDestroy {

  loading = false;
  originalTasks: Task[] = [];
  tasks$!: Observable<Task[]>;

  tagsSelected = new FormControl('');
  tagsList: string[] = [];

  private taskSavedSubscription: Subscription = new Subscription();

  constructor(private taskService: TaskService, private dialog: MatDialog, private copyService: DeepCopyService,
              private toastr: ToastrService) {}

  ngOnInit(): void {

    this.updateTasks();

    this.subscribeTagsSelected();

    this.subscribeTaskSaved();
  }

  updateTasks(){

    this.loading = true;

    this.tasks$ = this.taskService.getAllTasks().pipe(
      tap(tasks => {
        this.originalTasks = tasks; // Store the original list of tasks
        const tagsAll = tasks.flatMap(task => task.tags ? task.tags.map(tag => tag.name) : []);
        this.tagsList = [...new Set(tagsAll)];
        this.tagsSelected.updateValueAndValidity();
        this.loading = false;
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

    // Crear una copia limpia de la tarea para tener adento del modal.
    const taskCopy = task ? this.copyService.deepCopy(task) : {};

    const dialogRef = this.dialog.open(TaskSaveComponent, {
      height: '400px',
      width: '600px',
      data: {...taskCopy}, // Pasar una copia de la tarea para evitar actualizando los datos sin querer.
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(
      {
        next: (deletedTask: Task) => {
        const msg = 'Tarea se ha borrado con éxito.';
        this.toastr.success(msg);
        console.log(msg);
        this.updateTasks();
      },
        error: (error) => {
          const msg = 'Error borrando tarea';
          this.toastr.error(msg);
          console.error(msg, error);
          this.updateTasks();
        }
      }
    );
  }

}

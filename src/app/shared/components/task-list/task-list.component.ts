import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, of, tap } from 'rxjs';
import { Task } from '../../../models/task.model';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskModifyComponent } from '../task-modify/task-modify.component';
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
  
  tasks$!: Observable<Task[]>;

  tagsSelected = new FormControl('');
  tagsList: string[] = [];

  private taskModifiedSubscription: Subscription = new Subscription();

  constructor(private taskService: TaskService, private dialog: MatDialog, private copyService: DeepCopyService) {}

  ngOnInit(): void {

    this.tagsSelected.valueChanges.subscribe(
      (values:any): void => {

        let arr = [...values]

        this.filterTasksByTags(arr);
        
        }
    );
    
    this.tasks$ = this.taskService.getAllTasks().pipe(

      map(tasks => {
        // Side Effect: crear un listado de todas las etiquetas disponibles
        const tagsAll = tasks.flatMap(task => task.tags.map(tag => tag.name));

        // Quitar los duplicados
        this.tagsList = [...new Set(tagsAll)];
        
        return tasks;
      })
      
    );
    
      
    

    this.taskModifiedSubscription = this.taskService.taskModified$().subscribe(
      (modifiedTask) => {
        // Manejar el evento de modificación de la tarea
        console.log('Evento de tarea modificado se ha recibido:', modifiedTask);

        // Actualizar la tarea única en el observable tasks$
        this.tasks$ = this.tasks$.pipe(
          map(tasks => tasks.map(task => task.id === modifiedTask.id ? modifiedTask : task))
        );

      }
    );
 
  }

  filterTasksByTags(tags: string[]): void {

    // Update the tasks$ observable based on selected tags
    this.tasks$ = this.taskService.getAllTasks().pipe(
      map(tasks => tasks.filter(task => tags.every(tag => task.tags.some(taskTag => taskTag.name === tag))))
    );
  }

  ngOnDestroy() {
    this.taskModifiedSubscription.unsubscribe();
  }

  openTaskModal(task: Task, enterAnimationDuration: string, exitAnimationDuration: string): void {

    // Crear una copia de la tarea para tener adento del modal.
    const taskCopy = this.copyService.deepCopy(task);

    const dialogRef = this.dialog.open(TaskModifyComponent, {
      height: '400px',
      width: '600px',
      data: {...taskCopy}, // Pasar una copia de la tarea para evitar actualizando los datos sin querer.
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}

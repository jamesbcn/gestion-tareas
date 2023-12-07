import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, of, tap } from 'rxjs';
import { Task } from '../../../models/task.model';
import { AsyncPipe, JsonPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskSaveComponent } from '../task-save/task-save.component';
import { DeepCopyService } from '../../services/deep-copy.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, TitleCasePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, 
            FormsModule, ReactiveFormsModule, JsonPipe, MatRadioModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})

export class TaskListComponent implements OnInit, OnDestroy {

  originalTasks: Task[] = [];
  tasks$!: Observable<Task[]>;

  tagsSelected = new FormControl('');
  tagsList: string[] = [];

  filterSelected: string = 'Todas';
  filterOptions: string[] = ['Algunas', 'Todas'];

  private taskSavedSubscription: Subscription = new Subscription();

  constructor(private taskService: TaskService, private dialog: MatDialog, private copyService: DeepCopyService,
              private toastr: ToastrService) {}

  ngOnInit(): void {

    this.updateTasks();

    this.subscribeTagsSelected();

    this.subscribeTaskSaved();
  }

  radioChange(event: MatRadioChange){

    this.filterSelected = event.value; // Algunas o Todas

    this.tagsSelected.updateValueAndValidity(); // Actualizar validad de tareas
    
  }

  updateTasks(){

    this.tasks$ = this.taskService.getAllTasks().pipe(
      tap(tasks => {
        this.originalTasks = tasks; // Store the original list of tasks
        const tagsAll = tasks.flatMap(task => task.tags ? task.tags.map(tag => tag.name) : []);
        this.tagsList = [...new Set(tagsAll)];
        this.tagsSelected.updateValueAndValidity();
      })
    );

  }

  subscribeTagsSelected(){

    this.tagsSelected.valueChanges.subscribe(
      (values: any): void => {
  
        const arr = [...values];
        
        switch(this.filterSelected){
          case "Todas":
            this.filterTasksByTagsAll(arr);
            break;
          case "Algunas":
            this.filterTasksByTagsAny(arr);
            break;
          default:
            this.toastr.error("Error en el filtro de etiquetas");
        }
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

  
  filterTasksByTagsAll(selectedTags: string[]): void {

    // Paso 1: Obtener las tareas originales
    const originalTasks = this.originalTasks;
  
    // Paso 2: Filtrar tareas según si tienen todas las etiquetas seleccionadas (every)
    const filteredTasks = originalTasks.filter(task =>
      // Check if every selected tag is present in the task's tags
      selectedTags.every(selectedTag =>
        task.tags.some(taskTag => taskTag.name === selectedTag)
      )
    );
  
    // // Paso 3: Actualizar el observable tareas$ con las tareas filtradas
    this.tasks$ = of(filteredTasks);
  }
  

  filterTasksByTagsAny(selectedTags: string[]): void {

    // Paso 1: Obtener las tareas originales
    const originalTasks = this.originalTasks;
  
    // Paso 2: Filtrar tareas según si tienen al menos una etiqueta seleccionada
    const filteredTasks = originalTasks.filter(task =>
      // Verificar si al menos una etiqueta de la tarea tiene un nombre que coincida con alguna etiqueta seleccionada
      task.tags.some(taskTag => selectedTags.includes(taskTag.name))
    );
  
    // Paso 3: Actualizar el observable tareas$ con las tareas filtradas
    this.tasks$ = of(filteredTasks);
  }
  


  ngOnDestroy() {
    this.taskSavedSubscription.unsubscribe();
  }

  openTaskModal(enterAnimationDuration: string, exitAnimationDuration: string, task?: Task): void {

    // Crear una copia limpia de la tarea para tener adento del modal.
    const taskCopy = task ? this.copyService.deepCopy(task) : {title: '', description: '', tags: []};

    const dialogRef = this.dialog.open(TaskSaveComponent, {
      height: '530px',
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

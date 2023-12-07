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
  

  filterTasksByTagsAll(tags: string[]): void {
    // Filter tasks in-memory based on selected tags
    const originalTasks = this.originalTasks;
      // Filter tasks based on the condition inside the parentheses
      this.tasks$ = of(
        // Use the 'filter' method to iterate through 'originalTasks'
        originalTasks.filter(task =>
          // Use 'every' to check if every tag in 'tags' satisfies the condition
          tags.every((tag: any) =>
            // Use 'some' to check if at least one taskTag in 'task.tags' satisfies the condition
            task.tags.some(taskTag => taskTag.name === tag)
          )
        )
      );
  }

  filterTasksByTagsAny(tags: string[]): void {
    
    const originalTasks = this.originalTasks;

    // Filter tasks based on the condition inside the parentheses
    this.tasks$ = of(
      // Use the 'filter' method to iterate through 'originalTasks'
      originalTasks.filter(task =>
        // Use 'some' to check if at least one tag in 'tags' matches any taskTag in 'task.tags'
        tags.some((tag: any) =>
          // Use 'some' to check if at least one taskTag in 'task.tags' satisfies the condition
          task.tags.some(taskTag => taskTag.name === tag)
        )
      )
    );
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

import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import {MAT_DIALOG_DATA, 
  MatDialogActions, MatDialogRef,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Task } from '../../../models/task.model';
import { AsyncPipe, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { TaskTagsComponent } from '../task-tags/task-tags.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-task-save',
  standalone: true,
  imports: [NgStyle, AsyncPipe, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatDialogClose, TaskTagsComponent],
  templateUrl: './task-save.component.html',
  styleUrl: './task-save.component.sass'
})
export class TaskSaveComponent {

  saveForm: FormGroup;
  task: Task;



  constructor(private taskService: TaskService, @Inject(MAT_DIALOG_DATA) task: Task, public fb: FormBuilder,
              private dialogRef: MatDialogRef<TaskSaveComponent>, private toastr: ToastrService,
              private cdr: ChangeDetectorRef, public loadingService: LoadingService) {

    this.task = task;

    this.saveForm = this.fb.group({
      title: new FormControl(task.title),
      description: new FormControl(task.description),
      tags: new FormControl(task.tags)
    });

   }


   
   saveChanges() {

    this.loadingService.loadingOn();

    const changes = this.saveForm.value;

    // Actualizar las propiedades correspondientes de this.task
    this.task = { ...this.task, ...changes };

    this.cdr.detach(); // Evitar ver cambios en los valores en la vista durante la animación de cierre del modal 

    this.taskService.saveTask(this.task.id, this.task)
      .pipe(take(1))
      .subscribe(
          {
            next: (savedTask) => {
                  const msg = "Tarea se ha guardado con éxito"
                  console.log(msg, savedTask);
                  this.toastr.success(msg);

                  this.dialogRef.close(savedTask);
            },
            error: (error) => {
                  const msg = 'Error guardando la tarea';
                  console.error(msg, error);
                  this.toastr.error(msg);

            },
            complete: () => this.loadingService.loadingOff()
          }
        );


  }
}

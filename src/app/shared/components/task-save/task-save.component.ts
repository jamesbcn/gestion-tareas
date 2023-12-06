import { Component, Inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import {MAT_DIALOG_DATA, 
  MatDialogActions, MatDialogRef,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Task } from '../../../models/task.model';
import { NgFor, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { TaskTagsComponent } from '../task-tags/task-tags.component';

@Component({
  selector: 'app-task-save',
  standalone: true,
  imports: [NgFor, NgStyle, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatDialogClose, TaskTagsComponent],
  templateUrl: './task-save.component.html',
  styleUrl: './task-save.component.sass'
})
export class TaskSaveComponent {

  
  public loading = false;

  public saveForm: FormGroup;

  constructor(private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task, public fb: FormBuilder,
              private dialogRef: MatDialogRef<TaskSaveComponent>, private toastr: ToastrService) {

    this.saveForm = this.fb.group({
      title: new FormControl(task.title),
      description: new FormControl(task.description),
      tags: new FormControl(task.tags)
    });

   }

   
   saveChanges() {

    // Deestructurar valores de los controles del formulario
    const { title, description, tags } = this.saveForm.value;

    // Actualizar las propiedades correspondientes de this.task
    this.task = { ...this.task, title, description, tags };

    this.taskService.saveTask(this.task.id, this.task).subscribe(
        {
          next: (savedTask) => {
                const msg = "Tarea se ha guardado con éxito"
                console.log(msg, savedTask);
                this.toastr.success(msg);
                
                this.taskService.emitTaskSaved(savedTask);

                this.dialogRef.close();

                setTimeout(() => this.loading = false, 2000);

          },
          error: (error) => {
                const msg = 'Error guardando la tarea';
                console.error(msg, error);
                this.toastr.error(msg);

                setTimeout(() => this.loading = false, 2000);
          }
        }
      );


  }
}

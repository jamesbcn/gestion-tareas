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

  public saveForm: FormGroup;
  public modified: Boolean = false;

  constructor(private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task, public fb: FormBuilder,
              private dialogRef: MatDialogRef<TaskSaveComponent>, private toastr: ToastrService) {

    this.saveForm = this.fb.group({
      title: new FormControl(task.title || ''),
      description: new FormControl(task.description || ''),
      tags: new FormControl(task.tags || [])
    });

    console.log(this.saveForm )


    this.saveForm.valueChanges.subscribe(({ title, description, tags }) => {

      if( !this.modified ) {
        this.modified = true;
      }

      this.task = { ...this.task, title, description, tags };

      /* El objeto { title, description, tags } se desestructura del objeto de valor emitido por el observable valueChanges. 
        Luego, utilizando el operador de propagación (...) se copian las propiedades existentes de this.task en un nuevo objeto, 
        y las propiedades de título y descripción se actualizan con los nuevos valores. 
      */

    });

    // this.saveForm.controls['tags'].statusChanges.subscribe((value: any)=>{

    //   console.log("status change!", value)
    //  })

    //  this.saveForm.controls['tags'].valueChanges.subscribe((value: any)=>{

    //   console.log("value change!", value)
    //  })

   }

   

   saveChanges() {
    if (true) {
      this.taskService.saveTask(this.task.id, this.task).subscribe(
        {
          next: (savedTask) => {
                const msg = "Tarea se ha guardado con éxito"
                console.log(msg, savedTask);
                this.toastr.success(msg);
                
                this.taskService.emitTaskSaved(savedTask);

                // Close the dialog when changes are saved
                this.dialogRef.close();

          },
          error: (error) => {
                const msg = 'Error guardando la tarea';
                console.error(msg, error);
                this.toastr.error(msg);
          }
        }
      );
    } else {
      console.log('Ningún cambio para guardar.');
    }

  }
}

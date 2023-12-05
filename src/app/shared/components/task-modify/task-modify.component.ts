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

import { TaskTagsComponent } from '../task-tags/task-tags.component';

@Component({
  selector: 'app-task-modify',
  standalone: true,
  imports: [NgFor, NgStyle, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatDialogClose, TaskTagsComponent],
  templateUrl: './task-modify.component.html',
  styleUrl: './task-modify.component.sass'
})
export class TaskModifyComponent {

  public modifyForm: FormGroup;
  public modified: Boolean = false;

  constructor(private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task, public fb: FormBuilder,
              private dialogRef: MatDialogRef<TaskModifyComponent>) {

    this.modifyForm = this.fb.group({
      title: new FormControl(task.title),
      description: new FormControl(task.description),
      tags: new FormControl(task.tags)
    });

    console.log(this.modifyForm )


    this.modifyForm.valueChanges.subscribe(({ title, description, tags }) => {

      if( !this.modified ) {
        this.modified = true;
      }

      this.task = { ...this.task, title, description, tags };

      /* El objeto { title, description, tags } se desestructura del objeto de valor emitido por el observable valueChanges. 
        Luego, utilizando el operador de propagación (...) se copian las propiedades existentes de this.task en un nuevo objeto, 
        y las propiedades de título y descripción se actualizan con los nuevos valores. 
      */

    });

    this.modifyForm.controls['tags'].statusChanges.subscribe((value: any)=>{

      console.log("status change!", value)
     })

     this.modifyForm.controls['tags'].valueChanges.subscribe((value: any)=>{

      console.log("value change!", value)
     })

   }

   

   saveChanges() {
    if (true) {
      this.taskService.modifyTask(this.task.id, this.task).subscribe(
        {
          next: (modifiedTask) => {
                console.log('Tarea se ha modificado con éxito:', modifiedTask);
                
                this.taskService.emitTaskModified(modifiedTask);

                // Close the dialog when changes are saved
                this.dialogRef.close();

          },
          error: (error) => {
                console.error('Error modificando la tarea:', error);
                // Handle error cases
          }
        }
      );
    } else {
      console.log('Ningún cambio para guardar.');
    }

  }
}

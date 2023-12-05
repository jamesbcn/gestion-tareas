import { Component, Inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import {MAT_DIALOG_DATA, 
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Task } from '../../../models/task.model';
import { NgFor, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-task-modify',
  standalone: true,
  imports: [NgFor, NgStyle, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatDialogClose],
  templateUrl: './task-modify.component.html',
  styleUrl: './task-modify.component.sass'
})
export class TaskModifyComponent {

  modifyForm: FormGroup;
  modified: Boolean = false;

  constructor(private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task, public fb: FormBuilder) {

    this.modifyForm = this.fb.group({
      title: new FormControl(task.title),
      description: new FormControl(task.description)
    });


    this.modifyForm.valueChanges.subscribe(({ title, description }) => {

      if( !this.modified ) {
        this.modified = true;
      }

      this.task = { ...this.task, title, description };

      /* El objeto { title, description } se desestructura del objeto de valor emitido por el observable valueChanges. 
        Luego, utilizando el operador de propagación (...) se copian las propiedades existentes de this.task en un nuevo objeto, 
        y las propiedades de título y descripción se actualizan con los nuevos valores. 
      */

    });

   }

   saveChanges() {
    if (this.modified) {
      this.taskService.modifyTask(this.task.id, this.task).subscribe(
        {
          next: (modifiedTask) => {
          console.log('Task modified successfully:', modifiedTask);
          // Handle any additional logic after modifying the task
          },
          error: (error) => {
            console.error('Error modifying task:', error);
            // Handle error cases
          }
        }
      );
    } else {
      console.log('No changes to save.');
    }

  }
}

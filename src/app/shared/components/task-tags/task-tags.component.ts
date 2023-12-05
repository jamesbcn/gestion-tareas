import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, inject, Input} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-task-tags',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule],
  templateUrl: './task-tags.component.html',
  styleUrl: './task-tags.component.sass'
})
export class TaskTagsComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @Input()
  tags: Tag[] = [];

  announcer = inject(LiveAnnouncer);

  tagAlreadyExists(tagName: string): boolean {
    return this.tags.some(tag => tag.name === tagName);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Añadir la etiqueta
    if (value && !this.tagAlreadyExists(value)) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: Tag, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }

}

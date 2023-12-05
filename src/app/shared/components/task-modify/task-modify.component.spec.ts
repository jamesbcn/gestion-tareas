import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskModifyComponent } from './task-modify.component';

describe('TaskModifyComponent', () => {
  let component: TaskModifyComponent;
  let fixture: ComponentFixture<TaskModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskModifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

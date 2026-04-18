import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPatientComponent } from './dialog-patient.component';

describe('DialogPatientComponent', () => {
  let component: DialogPatientComponent;
  let fixture: ComponentFixture<DialogPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

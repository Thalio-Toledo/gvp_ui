import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHospitalComponent } from './dialog-hospital.component';

describe('DialogHospitalComponent', () => {
  let component: DialogHospitalComponent;
  let fixture: ComponentFixture<DialogHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

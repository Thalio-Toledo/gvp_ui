import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { PatientService } from '../../services/patient.service';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let patientService: jasmine.SpyObj<PatientService>;

  beforeEach(async () => {
    patientService = jasmine.createSpyObj('PatientService', ['list']);
    patientService.list.and.returnValue(of([
      {
        patientId: '1',
        name: 'João',
        age: 30,
        entranceAt: new Date(2026, 0, 1),
        exitAt: new Date(2026, 0, 3),
        hospitalId: 'h1',
        hospital: {} as any,
        visits: []
      }
    ]));

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [{ provide: PatientService, useValue: patientService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients on init and expose them by day', () => {
    expect(patientService.list).toHaveBeenCalled();
    expect(component.getVisitsByDay(new Date(2026, 0, 2)).length).toBeGreaterThan(0);
    expect(component.getVisitsByDay(new Date(2026, 0, 2))[0].visitName).toBe('João');
  });
});

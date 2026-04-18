import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { DialogHospitalComponent } from '../../components/dialog-hospital/dialog-hospital.component';
import { Mode } from '../../enums/mode';
import { Hospital } from '../../models/hospital';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { DialogPatientComponent } from '../../components/dialog-patient/dialog-patient.component';
import { HospitalService } from '../../services/hospital.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, Button, TableModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.less',
  providers:[DialogService]
})
export class PatientsComponent {
  patientService = inject(PatientService)

  patients = signal<Patient[]>([])
  ref: DynamicDialogRef | undefined;

  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }

  listHospitals(){
    this.patientService.list().subscribe((res =>{
      this.patients.set(res)
      console.log(res)
    }))
  }

  createPatient(): void {
    this.ref = this.dialogService.open(DialogPatientComponent, {
      header: 'Paciente',
      width: '30%',
      closable: true,
      data: {mode: Mode.creation }
    });
    this.ref.onClose.subscribe(patient => {
      if(patient) this.patients.set(this.patients().concat(patient))
    });
  }

  editPatient(patient: Patient): void {
    this.ref = this.dialogService.open(DialogPatientComponent, {
      header: 'Paciente',
      width: '30%',
      closable: true,
      data: { patient, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(patient => {
      if(patient){
        this.patients.set(this.patients().map(patientMap =>{
          if(patient.patientId == patientMap.patientId) patientMap = patient 
          return patientMap
        }))
      }
      }
    );
  }

  deletePatient(patient: Patient){
    this.patientService.delete(patient).subscribe((res)=>{
      if(res){
        this.patients.set(this.patients().filter(p => p.patientId != patient.patientId))
      }
    })
  }
}

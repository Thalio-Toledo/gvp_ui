import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Mode } from '../../enums/mode';
import { Hospital } from '../../models/hospital';
import { HospitalService } from '../../services/hospital.service';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-dialog-patient',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, IftaLabelModule, FormsModule, ButtonModule, CommonModule,Select,InputNumber,DatePicker],
  templateUrl: './dialog-patient.component.html',
  styleUrl: './dialog-patient.component.less'
})
export class DialogPatientComponent {

  form: FormGroup
  patient: Patient = null
  hospitals = signal<Hospital[]>([])
  mode = Mode.creation
  
  constructor(
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private patientService: PatientService,
    private hospitalService: HospitalService
  ){
    this.getHospitals()
    console.log(this.config.data)
    Object.assign(this, this.config.data)
      this.form = new FormGroup({
          patientName: new FormControl<string | null>('',[Validators.required]),
          age: new FormControl<string | null>('',[Validators.required]),
          entranceAt: new FormControl<Date | null>(null,[Validators.required]),
          exitAt: new FormControl<Date | null>(null,[Validators.required]),
          hospital: new FormControl<Hospital | null>(null,[Validators.required])
    });

   
  }

  getHospitals(){
    this.hospitalService.list().subscribe(res=>{
      this.hospitals.set(res)

       if(this.mode == Mode.edition){
        this.form.get('patientName').setValue(this.patient.name)
        this.form.get('age').setValue(this.patient.age)
        this.form.get('entranceAt').setValue(new Date(this.patient.entranceAt))
        this.form.get('exitAt').setValue(new Date(this.patient.exitAt))
        this.form.get('hospital').setValue(this.hospitals().find(h => h.hospitalId == this.patient.hospitalId))
      }
    })
  }
  
  save(){
    console.log( this.form.value)
    this.patientService.create(
      {
        name:  this.form.value.patientName,
        age: this.form.value.age,
        entranceAt: this.form.value.entranceAt,
        exitAt: this.form.value.exitAt,
        hospitalId : this.form.value.hospital.hospitalId,
      } as Patient).subscribe((result)=>{
        this.ref.close(result)
      })
  }

  update(){
      this.patientService.update(
      {
        patientId: this.patient.patientId,
        name:  this.form.value.patientName,
        age: this.form.value.age,
        entranceAt: this.form.value.entranceAt,
        exitAt: this.form.value.exitAt,
        hospitalId : this.form.value.hospital.hospitalId,
        hospital: this.form.value.hospital
      } as Patient).subscribe((result)=>{
        this.ref.close(result)
      })
  }
}

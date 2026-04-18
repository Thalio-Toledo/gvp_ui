import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Visitor } from '../../models/visitor';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Mode } from '../../enums/mode';
import { Hospital } from '../../models/hospital';
import { HospitalService } from '../../services/hospital.service';
import { VisitorService } from '../../services/visitor.service';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-dialog-visitor',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, IftaLabelModule, FormsModule, ButtonModule, CommonModule,Select,InputNumber, DatePicker],
  templateUrl: './dialog-visitor.component.html',
  styleUrl: './dialog-visitor.component.less'
})
export class DialogVisitorComponent {

    form: FormGroup
    visitor: Visitor = null
    hospitals = signal<Hospital[]>([])
    mode = Mode.creation
    
    constructor(
      public config: DynamicDialogConfig,
      private ref: DynamicDialogRef,
      private visitorService: VisitorService,
      private hospitalService: HospitalService
    ){
      this.getHospitals()
      console.log(this.config.data)
      Object.assign(this, this.config.data)
        this.form = new FormGroup({
            visitorName: new FormControl<string | null>('',[Validators.required]),
            birthDate: new FormControl<Date | null>(null, [Validators.required]),
            emailJwpub: new FormControl<string | null>('', [Validators.required]),
            emailPersonal: new FormControl<string | null>('', [Validators.required]),
            phoneNumber: new FormControl<string | null>('', [Validators.required]),
      });
    }
  
    getHospitals(){
      this.hospitalService.list().subscribe(res=>{
        this.hospitals.set(res)
  
         if(this.mode == Mode.edition){
          this.form.get('visitorName').setValue(this.visitor.name)
          this.form.get('birthDate').setValue(new Date(this.visitor.birthDate))
          this.form.get('emailJwpub').setValue(this.visitor.emailJwpub)
          this.form.get('emailPersonal').setValue(this.visitor.emailPersonal)
          this.form.get('phoneNumber').setValue(this.visitor.phoneNumber)
        }
      })
    }
    
    save(){
      console.log( this.form.value)
      this.visitorService.create(
        {
          name:  this.form.value.visitorName,
          birthDate:  this.form.value.birthDate,
          emailJwpub:  this.form.value.emailJwpub,
          emailPersonal:  this.form.value.emailPersonal,
          phoneNumber:  this.form.value.phoneNumber,
        } as Visitor).subscribe((result)=>{
          this.ref.close(result)
        })
    }
  
    update(){
        this.visitorService.update(
        {
          visitorId: this.visitor.visitorId,
          name:  this.form.value.visitorName,
          birthDate:  this.form.value.birthDate,
          emailJwpub:  this.form.value.emailJwpub,
          emailPersonal:  this.form.value.emailPersonal,
          phoneNumber:  this.form.value.phoneNumber,
        } as Visitor).subscribe((result)=>{
          this.ref.close(result)
        })
    }
}

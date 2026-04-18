import { Component, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital';
import { ButtonModule } from 'primeng/button';
import { Mode } from '../../enums/mode';

@Component({
  selector: 'app-dialog-hospital',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, IftaLabelModule, FormsModule, ButtonModule],
  templateUrl: './dialog-hospital.component.html',
  styleUrl: './dialog-hospital.component.less'
})
export class DialogHospitalComponent {
  form: FormGroup
  hospital: Hospital = null
  mode = Mode.creation

    constructor(
      public config: DynamicDialogConfig,
      private ref: DynamicDialogRef,
      private hospitalService: HospitalService
    ){
      Object.assign(this, this.config.data)
        this.form = new FormGroup({
            hospitalName: new FormControl<string | null>('',[Validators.required]),
            address: new FormControl<string | null>('',[Validators.required])
      });

      console.log(this.config.data,'this.config.data')

      if(this.mode == Mode.edition){
        this.form.get('hospitalName').setValue(this.hospital.name)
        this.form.get('address').setValue(this.hospital.address)
      }
    }

    

    save(){
      this.hospitalService.create(
        {
           name:  this.form.value.hospitalName,
           address: this.form.value.address 
        } as Hospital).subscribe((result)=>{
          this.ref.close(result)
        })
    }

    update(){
        this.hospitalService.update(
        {
          hospitalId: this.hospital.hospitalId,
          name:  this.form.value.hospitalName,
          address: this.form.value.address 
        } as Hospital).subscribe((result)=>{
          this.ref.close(result)
        })
    }
}

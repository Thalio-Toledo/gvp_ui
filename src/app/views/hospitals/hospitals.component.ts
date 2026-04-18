import { Component, inject, signal } from '@angular/core';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital';
import { CommonModule } from '@angular/common';
import { DialogHospitalComponent } from '../../components/dialog-hospital/dialog-hospital.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from "primeng/button";
import { TableModule } from 'primeng/table';
import { Mode } from '../../enums/mode';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, Button, TableModule],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.less',
  providers:[DialogService]
})
export class HospitalsComponent {
  hospitalService = inject(HospitalService)
  hospitals = signal<Hospital[]>([])
  ref: DynamicDialogRef | undefined;

  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }

  listHospitals(){
    this.hospitalService.list().subscribe((res =>{
      this.hospitals.set(res)
      console.log(res)
    }))
  }

  createHospital(): void {
    this.ref = this.dialogService.open(DialogHospitalComponent, {
      header: 'Hospital',
      width: '30%',
      closable: true,
      data: {mode: Mode.creation }
    });
    this.ref.onClose.subscribe(hospital => this.hospitals.set(this.hospitals().concat(hospital)));
  }

  editHospital(hospital: Hospital): void {
    this.ref = this.dialogService.open(DialogHospitalComponent, {
      header: 'Hospital',
      width: '30%',
      closable: true,
      data: { hospital, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(hospital => {
        this.hospitals.set(this.hospitals().map(hospitalMap =>{
          if(hospital.hospitalId == hospitalMap.hospitalId) hospitalMap = hospital 
          return hospitalMap
        }))
      }
    );
  }

  deleteHospital(hospital: Hospital){
    this.hospitalService.delete(hospital).subscribe((res)=>{
      if(res){
        this.hospitals.set(this.hospitals().filter(h => h.hospitalId != hospital.hospitalId))
      }
    })

  }
}

import { Component, inject, signal, ViewChild } from '@angular/core';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogHospitalComponent } from '../../components/dialog-hospital/dialog-hospital.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Mode } from '../../enums/mode';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputTextModule, TableModule, TieredMenu],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.less',
  providers:[DialogService]
})
export class HospitalsComponent {
  @ViewChild('menu') menu!: TieredMenu;

  hospitalService = inject(HospitalService)
  hospitals = signal<Hospital[]>([])
  filteredHospitals = signal<Hospital[]>([])
  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [];
  searchTerm = '';

  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }

  listHospitals(){
    this.hospitalService.list().subscribe((res =>{
      this.hospitals.set(res)
      this.filteredHospitals.set(res)
    }))
  }

  createHospital(): void {
    this.ref = this.dialogService.open(DialogHospitalComponent, {
      header: 'Hospital',
      width: '30%',
      closable: true,
      data: {mode: Mode.creation }
    });
    this.ref.onClose.subscribe(hospital => {
      if (hospital) {
        const updatedHospitals = this.hospitals().concat(hospital);
        this.hospitals.set(updatedHospitals);
        this.applyFilter();
      }
    });
  }

  editHospital(hospital: Hospital): void {
    this.ref = this.dialogService.open(DialogHospitalComponent, {
      header: 'Hospital',
      width: '30%',
      closable: true,
      data: { hospital, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(updatedHospital => {
      if (updatedHospital) {
        const updatedHospitals = this.hospitals().map(hospitalMap => {
          if (updatedHospital.hospitalId == hospitalMap.hospitalId) {
            return updatedHospital;
          }
          return hospitalMap;
        });

        this.hospitals.set(updatedHospitals);
        this.applyFilter();
      }
    });
  }

  deleteHospital(hospital: Hospital){
    this.hospitalService.delete(hospital).subscribe((res)=>{
      if(res){
        const updatedHospitals = this.hospitals().filter(h => h.hospitalId != hospital.hospitalId);
        this.hospitals.set(updatedHospitals);
        this.applyFilter();
      }
    })
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredHospitals.set(this.hospitals());
      return;
    }

    this.filteredHospitals.set(
      this.hospitals().filter(hospital =>
        hospital.name.toLowerCase().includes(term) || hospital.address.toLowerCase().includes(term)
      )
    );
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  openMenu(event: Event, hospital: Hospital): void {
    this.menuItems = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editHospital(hospital)
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => this.deleteHospital(hospital)
      }
    ];

    this.menu.toggle(event);
  }
}

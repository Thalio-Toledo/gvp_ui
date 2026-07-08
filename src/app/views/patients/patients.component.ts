import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Mode } from '../../enums/mode';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { DialogPatientComponent } from '../../components/dialog-patient/dialog-patient.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputTextModule, TableModule, TieredMenu],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.less',
  providers:[DialogService]
})
export class PatientsComponent {
  @ViewChild('menu') menu!: TieredMenu;

  patientService = inject(PatientService)

  patients = signal<Patient[]>([])
  filteredPatients = signal<Patient[]>([])
  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [];
  searchTerm = '';

  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }

  listHospitals(){
    this.patientService.list().subscribe((res =>{
      this.patients.set(res)
      this.filteredPatients.set(res)
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
      if (patient) {
        const updatedPatients = this.patients().concat(patient);
        this.patients.set(updatedPatients);
        this.applyFilter();
      }
    });
  }

  editPatient(patient: Patient): void {
    this.ref = this.dialogService.open(DialogPatientComponent, {
      header: 'Paciente',
      width: '30%',
      closable: true,
      data: { patient, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(updatedPatient => {
      if (updatedPatient) {
        const updatedPatients = this.patients().map(patientMap => {
          if (updatedPatient.patientId == patientMap.patientId) {
            return updatedPatient;
          }
          return patientMap;
        });

        this.patients.set(updatedPatients);
        this.applyFilter();
      }
    });
  }

  deletePatient(patient: Patient){
    this.patientService.delete(patient).subscribe((res)=>{
      if(res){
        const updatedPatients = this.patients().filter(p => p.patientId != patient.patientId);
        this.patients.set(updatedPatients);
        this.applyFilter();
      }
    })
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredPatients.set(this.patients());
      return;
    }

    this.filteredPatients.set(
      this.patients().filter(patient =>
        patient.name.toLowerCase().includes(term) ||
        patient.hospital?.name?.toLowerCase().includes(term)
      )
    );
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  openMenu(event: Event, patient: Patient): void {
    this.menuItems = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editPatient(patient)
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => this.deletePatient(patient)
      }
    ];

    this.menu.toggle(event);
  }
}

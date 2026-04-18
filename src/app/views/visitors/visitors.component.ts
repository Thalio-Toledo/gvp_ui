import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Mode } from '../../enums/mode';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor';
import { DialogVisitorComponent } from '../../components/dialog-visitor/dialog-visitor.component';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, Button, TableModule],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.less',
  providers:[DialogService]
})
export class VisitorsComponent {
  visitorService = inject(VisitorService)

  visitors = signal<Visitor[]>([])
  ref: DynamicDialogRef | undefined;
  
  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }
  
  listHospitals(){
    this.visitorService.list().subscribe((res =>{
      this.visitors.set(res)
      console.log(res)
    }))
  }
  
  createVisitor(): void {
    this.ref = this.dialogService.open(DialogVisitorComponent, {
      header: 'Visitante',
      width: '30%',
      closable: true,
      data: {mode: Mode.creation }
    });
    this.ref.onClose.subscribe(visitor => {
      if(visitor) this.visitors.set(this.visitors().concat(visitor))
    });
  }
  
  editVisitor(visitor: Visitor): void {
    this.ref = this.dialogService.open(DialogVisitorComponent, {
      header: 'Visitante',
      width: '30%',
      closable: true,
      data: { visitor, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(patient => {
      if(patient){
        this.visitors.set(this.visitors().map(visitorMap =>{
          if(visitor.visitorId == visitorMap.visitorId) visitorMap = patient 
          return visitorMap
        }))
      }
      }
    );
  }
  
    deleteVisitor(visitor: Visitor){
      this.visitorService.delete(visitor).subscribe((res)=>{
        if(res){
          this.visitors.set(this.visitors().filter(v => v.visitorId != visitor.visitorId))
        }
      })
    }

}

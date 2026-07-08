import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Mode } from '../../enums/mode';
import { VisitorService } from '../../services/visitor.service';
import { Visitor } from '../../models/visitor';
import { DialogVisitorComponent } from '../../components/dialog-visitor/dialog-visitor.component';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputTextModule, TableModule, TieredMenu],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.less',
  providers:[DialogService]
})
export class VisitorsComponent {
  @ViewChild('menu') menu!: TieredMenu;

  visitorService = inject(VisitorService)

  visitors = signal<Visitor[]>([])
  filteredVisitors = signal<Visitor[]>([])
  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [];
  searchTerm = '';
  
  constructor( public dialogService: DialogService ){
    this.listHospitals()
  }
  
  listHospitals(){
    this.visitorService.list().subscribe((res =>{
      this.visitors.set(res)
      this.filteredVisitors.set(res)
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
      if (visitor) {
        const updatedVisitors = this.visitors().concat(visitor);
        this.visitors.set(updatedVisitors);
        this.applyFilter();
      }
    });
  }
  
  editVisitor(visitor: Visitor): void {
    this.ref = this.dialogService.open(DialogVisitorComponent, {
      header: 'Visitante',
      width: '30%',
      closable: true,
      data: { visitor, mode: Mode.edition}
    });
    this.ref.onClose.subscribe(updatedVisitor => {
      if (updatedVisitor) {
        const updatedVisitors = this.visitors().map(visitorMap => {
          if (updatedVisitor.visitorId == visitorMap.visitorId) {
            return updatedVisitor;
          }
          return visitorMap;
        });

        this.visitors.set(updatedVisitors);
        this.applyFilter();
      }
    });
  }
  
    deleteVisitor(visitor: Visitor){
      this.visitorService.delete(visitor).subscribe((res)=>{
        if(res){
          const updatedVisitors = this.visitors().filter(v => v.visitorId != visitor.visitorId);
          this.visitors.set(updatedVisitors);
          this.applyFilter();
        }
      })
    }

    applyFilter(): void {
      const term = this.searchTerm.trim().toLowerCase();

      if (!term) {
        this.filteredVisitors.set(this.visitors());
        return;
      }

      this.filteredVisitors.set(
        this.visitors().filter(visitor =>
          visitor.name.toLowerCase().includes(term) ||
          visitor.emailJwpub.toLowerCase().includes(term) ||
          visitor.emailPersonal.toLowerCase().includes(term)
        )
      );
    }

    onSearchChange(): void {
      this.applyFilter();
    }

    openMenu(event: Event, visitor: Visitor): void {
      this.menuItems = [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.editVisitor(visitor)
        },
        {
          label: 'Excluir',
          icon: 'pi pi-trash',
          command: () => this.deleteVisitor(visitor)
        }
      ];

      this.menu.toggle(event);
    }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

export interface VisitModalData {
  data: Date;
  visitName: string;
  hospitalName?: string;
  hospitalAddress?: string;
}

@Component({
  selector: 'app-visit-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, DatePipe],
  templateUrl: './visit-modal.component.html',
  styleUrl: './visit-modal.component.less'
})
export class VisitModalComponent {
  @Input() visible = false;
  @Input() visit: VisitModalData | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  onVisibleChange(value: boolean): void {
    this.visible = value;
    if (!value) {
      this.visibleChange.emit(false);
      this.closed.emit();
    }
  }
}

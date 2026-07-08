import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-dashboard.component.html',
  styleUrl: './my-dashboard.component.less'
})
export class MyDashboardComponent {
  userName = 'João Silva';
  userImage = 'https://i.pravatar.cc/150?img=12';

  visits = [
    { title: 'Visita ao Hospital Central', date: '08/07/2026', status: 'Agendada' },
    { title: 'Atendimento Pediátrico', date: '10/07/2026', status: 'Confirmada' },
    { title: 'Consulta de Rotina', date: '12/07/2026', status: 'Pendente' }
  ];
}

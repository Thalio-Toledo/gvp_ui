import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BreadcrumbModule, RouterModule, ButtonModule, Tooltip],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  collapsed = true;

  toggleMenu() {
    this.collapsed = !this.collapsed
  }

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  menu = [
  {icon:'pi pi-home', label:'Dashboard', routerLink: '/dashboard', visible: false },
  {icon:'pi pi-calendar', label: 'Calendário', routerLink: '/dashboard/calendar', visible: false },
  {icon:'pi pi-building',label: 'Hospitais', routerLink: '/dashboard/hospitals', visible: false },
  {icon:'pi pi-users',label: 'Pacientes', routerLink: '/dashboard/patients', visible: false },
  {icon:'pi pi-user',label: 'Visitantes', routerLink: '/dashboard/visitors', visible: false },
  {icon:'pi pi-comments',label: 'Feedbacks', routerLink: '/dashboard/agrupamentos', visible: false },
  {icon:'pi pi-chart-bar',label: 'Relatórios', routerLink: '/dashboard/agrupamentos', visible: false },
  {icon:'pi pi-cog',label: 'Configurações', routerLink: '/dashboard/agrupamentos', visible: false },
] as MenuItem[]
}

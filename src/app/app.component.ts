import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, CalendarComponent, MenuModule, BadgeModule, RippleModule, AvatarModule,RouterModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'Gvp_UI';

  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                separator: true
            },
            {
                label: 'Documents',
                items: [
                    {
                        label: 'Calendário',
                        icon: 'pi pi-calendar',
                        routerLink:'/calendar'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-search',
                    }
                ]
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                    }
                ]
            },
            {
                label: 'Configurações',
                items: [
                    {
                        label: 'Visitantes',
                        icon: 'pi pi-users',
                        routerLink:'/visitors'
                    },
                    {
                        label: 'Pacientes',
                        icon: 'pi pi-user',
                        badge: '2',
                        routerLink:'/patients'
                    },
                    {
                        label: 'Hospitais',
                        icon: 'pi pi-building',
                        routerLink:'/hospitals'
                    }
                ]
            },
            {
                separator: true
            }
        ];
    }
}

import { Routes } from '@angular/router';
import { HospitalsComponent } from './views/hospitals/hospitals.component';
import { PatientsComponent } from './views/patients/patients.component';
import { VisitorsComponent } from './views/visitors/visitors.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'calendar',
        pathMatch: 'full'
    },
    {
        path:'calendar',
        component: CalendarComponent
    },
    {
        path:'hospitals',
        component: HospitalsComponent
    },
    {
        path:'patients',
        component: PatientsComponent
    },
    {
        path:'visitors',
        component: VisitorsComponent
    },
];

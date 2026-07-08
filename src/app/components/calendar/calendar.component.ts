import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { VisitModalComponent } from '../visit-modal/visit-modal.component';

type ViewMode = 'day' | 'week' | 'month';

interface calendar{
  weekDays: string[]
  days: any[]
}

interface visit{
  data: Date
  visitName: string
  hospitalName?: string
  hospitalAddress?: string
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, VisitModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent implements OnInit {
  private patientService = inject(PatientService);

  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  events: visit[] = [];
  viewMode = signal<ViewMode>('month');
  selectedDate = signal(new Date());
  dialogVisible = false;
  selectedVisit: visit | null = null;
  private readonly tagColorPalette = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#8e24aa', '#00acc1'];
  private tagColorMap = new Map<string, string>();

  today = signal(new Date());
  month = computed(() => this.selectedDate().getMonth() + 1);
  year = computed(() => this.selectedDate().getFullYear())
  monthDays = computed(() => this.getDaysInMonth(this.year(), this.month()))
  monthName = computed(() => this.months[this.month() - 1]);
  calendar = computed(() => this.generateCalendar())

  ngOnInit(): void {
    this.patientService.list().subscribe((patients: Patient[]) => {
      this.events = patients.flatMap((patient) => {
        if (!patient.entranceAt || !patient.exitAt) {
          return [];
        }

        const startDate = new Date(patient.entranceAt);
        const endDate = new Date(patient.exitAt);
        const visits: visit[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          visits.push({
            data: new Date(currentDate),
            visitName: patient.name,
            hospitalName: patient.hospital?.name || 'Não informado',
            hospitalAddress: patient.hospital?.address || 'Não informado'
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return visits;
      });
    });
  }

  getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  getVisitsByDay(day: Date): visit[]{
    return this.events.filter(e => e.data.getDate() === day.getDate()
      &&  e.data.getMonth() === day.getMonth()
      && e.data.getFullYear() === day.getFullYear()
    )
  }

  generateCalendar(){
    let calendar : calendar = {
      weekDays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      days:[]
    }

    calendar.weekDays.forEach((weekday, index) => {
      if(this.monthDays()[0].getDay() == index){
        calendar.days.push(this.monthDays()[0])
          calendar.days = [...calendar.days, ...this.monthDays()
          .filter(d => d.getDate() != 1)
          .map(day => day)]
      }else if(this.monthDays()[0].getDay() > index) calendar.days.push("X")
    })

    return calendar
  }

  prevMonth(){
    const currentDate = new Date(this.selectedDate());

    if (this.viewMode() === 'day') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (this.viewMode() === 'week') {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    this.selectedDate.set(currentDate);
  }

  nextMonth(){
    const currentDate = new Date(this.selectedDate());

    if (this.viewMode() === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (this.viewMode() === 'week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    this.selectedDate.set(currentDate);
  }

  setViewMode(viewMode: ViewMode): void {
    this.viewMode.set(viewMode);
  }

  selectDate(day: Date): void {
    this.selectedDate.set(new Date(day));
    this.viewMode.set('day');
  }

  getWeekDays(): Date[] {
    const startOfWeek = new Date(this.selectedDate());
    const day = startOfWeek.getDay();
    const difference = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + difference);

    return Array.from({ length: 7 }, (_, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      return dayDate;
    });
  }

  getWeekdayName(day: Date): string {
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return weekdays[day.getDay()];
  }

  getMonthName(day: Date): string {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[day.getMonth()];
  }

  getTagColor(visit: visit): string {
    const key = visit.visitName;

    if (!this.tagColorMap.has(key)) {
      const usedColors = Array.from(this.tagColorMap.values());
      const availableColors = this.tagColorPalette.filter((color) => !usedColors.includes(color));
      const fallbackColor = this.tagColorPalette[Math.floor(Math.random() * this.tagColorPalette.length)];
      const nextColor = availableColors.length > 0
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : fallbackColor;

      this.tagColorMap.set(key, nextColor);
    }

    return this.tagColorMap.get(key) || this.tagColorPalette[0];
  }

  openVisitDialog(visit: visit): void {
    this.selectedVisit = visit;
    this.dialogVisible = true;
  }

  closeVisitDialog(): void {
    this.dialogVisible = false;
    this.selectedVisit = null;
  }

  markToday(day: Date){
    const today = this.today();

    if(today.getDate() == day.getDate() &&
      today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear() ) return 'today'
    return ''
  }
}

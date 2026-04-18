import { Component, computed, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface calendar{
  weekDays: string[]
  days: any[]
}

interface visit{
  data: Date
  visitName: string
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent {
 months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

 events :visit [] = [
   {data: new Date(2025,10, 2), visitName: 'Visita 1'},
   {data: new Date(2025,10, 4), visitName: 'Visita 2'}, 
   {data: new Date(2025,10, 10), visitName: 'Visita 3'}, 
   {data: new Date(2025,10, 26), visitName: 'Visita 4'}, 
   {data: new Date(2025,9, 7), visitName: 'Visita 4'}, 
   {data: new Date(2025,11, 5), visitName: 'Visita 4'}, 
   {data: new Date(2025,11, 1), visitName: 'Visita 4'}, 
   {data: new Date(2026,0, 30), visitName: 'Visita 10'}, 
   {data: new Date(2026,0, 31), visitName: 'Visita 10'}, 
]

  today = signal(new Date().getDate())
  month = signal(new Date().getMonth() + 1);
  year = signal( new Date().getFullYear())
  monthDays = computed(() =>this.getDaysInMonth(this.year(), this.month()))
  monthName = computed(() => this.months[this.month() -1]);
  calendar = computed(()=> this.generateCalendar())

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
    console.log(day, 'day')
    console.log(this.events, 'evetns')
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
    this.month.update(m => {
      if(m === 1){
        this.year.update(y=> y - 1)
        return 12;
      } 
      else return m - 1
    })
    
  }
  nextMonth(){
    this.month.update(m => {
      if(m == 12){
        this.year.update(y=> y + 1)
        return 1;
      } 
      else return m + 1
    })
  }

  markToday(day: Date){
    if(this.today() == day.getDate() && 
      new Date().getMonth() === day.getMonth() && new Date().getFullYear() === day.getFullYear() ) return 'today'
    return ''
  }
}

import { Component } from '@angular/core';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {
  eventList: EventModel[] = [];
  selectedEvent: EventModel | undefined;

  constructor(private eventService: EventService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.selectedEvent = nav?.extras?.state?.['event'];
  }

  ngOnInit(): void {
    if (!this.selectedEvent) {
      this.eventService.getAllEvents().subscribe({
        next: (data: EventModel[]) =>
          (this.eventList = data.filter(
            (event: EventModel) => event.Type === 'Event'
          )),
        error: (err: any) => console.error('Error fetching events:', err),
      });
    }
  }

  bookTickets(event: EventModel): void {
    this.router.navigate(['/booking'], { state: { event } });
  }

  goToDetails(event: EventModel): void {
    this.router.navigate(['/events'], { state: { event } });
  }
}

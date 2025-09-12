import { Component, OnInit } from '@angular/core';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-dashboard',
  standalone: false,
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.css'],
})
export class EventDashboardComponent implements OnInit {
  movieList: EventModel[] = [];
  upcomingEventList: EventModel[] = [];
  sportsList: EventModel[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: EventModel[]) => {
        console.log('Received data:', data);
        if (data && Array.isArray(data)) {
          this.movieList = data.filter((event) => event.Type === 'Movie');
          this.upcomingEventList = data.filter(
            (event) => event.Type === 'Event'
          );
          this.sportsList = data.filter((event) => event.Type === 'Sports');
        } else {
          console.error('Data is not an array:', data);
        }
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
        console.error('Error details:', err.message);
      },
      complete: () => console.log('Event data fetch complete.'),
    });
  }
  goToMovie(event: EventModel): void {
    this.router.navigate(['/movies'], { state: { movie: event } });
  }

  goToEvent(event: EventModel): void {
    this.router.navigate(['/events'], { state: { event } });
  }

  goToSports(event: EventModel): void {
    this.router.navigate(['/sports'], { state: { sport: event } });
  }
}

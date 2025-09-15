import { Component, OnInit } from '@angular/core';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';
import { Router } from '@angular/router';
import { UserStateService } from '../user-state-service.service';

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
  isLoggedIn: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private userStateService: UserStateService
  ) {
    // Subscribe to user state to check login status
    this.userStateService.currentUserState.subscribe((userState) => {
      this.isLoggedIn = userState?.isLoggedIn || false;
    });
  }

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
    this.router.navigate(['/movies', event.EventID], {
      state: { movie: event },
    });
  }

  goToEvent(event: EventModel): void {
    this.router.navigate(['/events', event.EventID], { state: { event } });
  }

  goToSports(event: EventModel): void {
    this.router.navigate(['/sports', event.EventID], {
      state: { sport: event },
    });
  }

  bookTickets(event: EventModel): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/booking'], { state: { event } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }
}

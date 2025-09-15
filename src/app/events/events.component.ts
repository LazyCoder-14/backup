import { Component } from '@angular/core';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';
import { Router, ActivatedRoute } from '@angular/router';
import { UserStateService } from '../user-state-service.service';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {
  eventList: EventModel[] = [];
  selectedEvent: EventModel | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private userStateService: UserStateService,
    private activatedRoute: ActivatedRoute
  ) {
    const nav = this.router.getCurrentNavigation();
    this.selectedEvent = nav?.extras?.state?.['event'];

    // Subscribe to user state to check login status
    this.userStateService.currentUserState.subscribe((userState) => {
      this.isLoggedIn = userState?.isLoggedIn || false;
    });
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: EventModel[]) => {
        this.eventList = data.filter(
          (event: EventModel) => event.Type === 'Event'
        );

        // If no event data from state, check route params
        if (!this.selectedEvent) {
          this.activatedRoute.paramMap.subscribe((params) => {
            const eventId = params.get('id');
            if (eventId) {
              this.selectedEvent = this.eventList.find(
                (e) => e.EventID === +eventId
              );
            }
          });
        }
      },
      error: (err: any) => console.error('Error fetching events:', err),
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

  rateEvent(event: EventModel): void {
    if (this.isLoggedIn) {
      // Navigate to feedback/rating page with event data
      this.router.navigate(['/feedback'], { state: { event } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }

  goToDetails(event: EventModel): void {
    this.router.navigate(['/events', event.EventID], { state: { event } });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';
import { UserStateService } from '../user-state-service.service';

@Component({
  selector: 'app-sports',
  standalone: false,
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css'],
})
export class SportsComponent implements OnInit {
  sportsList: EventModel[] = [];
  selectedSport: EventModel | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private userStateService: UserStateService,
    private activatedRoute: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.selectedSport = navigation.extras.state['sport'] as EventModel;
    }

    // Subscribe to user state to check login status
    this.userStateService.currentUserState.subscribe((userState) => {
      this.isLoggedIn = userState?.isLoggedIn || false;
    });
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: EventModel[]) => {
        this.sportsList = data.filter((event) => event.Type === 'Sports');

        // If no sport data from state, check route params
        if (!this.selectedSport) {
          this.activatedRoute.paramMap.subscribe((params) => {
            const sportId = params.get('id');
            if (sportId) {
              this.selectedSport = this.sportsList.find(
                (s) => s.EventID === +sportId
              );
            }
          });
        }
      },
      error: (err: any) => console.error('Error fetching sports events:', err),
    });
  }

  bookTickets(sport: EventModel): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/booking'], { state: { event: sport } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }

  rateEvent(sport: EventModel): void {
    if (this.isLoggedIn) {
      // Navigate to feedback/rating page with sport data
      this.router.navigate(['/feedback'], { state: { event: sport } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }

  goToDetails(sport: EventModel): void {
    this.router.navigate(['/sports', sport.EventID], { state: { sport } });
  }
}

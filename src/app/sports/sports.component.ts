import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private userStateService: UserStateService
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
    if (!this.selectedSport) {
      this.eventService.getAllEvents().subscribe({
        next: (data: EventModel[]) => {
          this.sportsList = data.filter((event) => event.Type === 'Sports');
        },
        error: (err: any) =>
          console.error('Error fetching sports events:', err),
      });
    }
  }

  bookTickets(sport: EventModel): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/booking'], { state: { event: sport } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }

  goToDetails(sport: EventModel): void {
    this.router.navigate(['/sports'], { state: { sport } });
  }
}

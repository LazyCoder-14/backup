import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { EventModel } from '../Event';

@Component({
  selector: 'app-sports',
  standalone: false,
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css'],
})
export class SportsComponent implements OnInit {
  sportsList: EventModel[] = [];
  selectedSport: EventModel | undefined;

  constructor(private eventService: EventService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.selectedSport = navigation.extras.state['sport'] as EventModel;
    }
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
    this.router.navigate(['/booking'], { state: { event: sport } });
  }

  goToDetails(sport: EventModel): void {
    this.router.navigate(['/sports'], { state: { sport } });
  }
}

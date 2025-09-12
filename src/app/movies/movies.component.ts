import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventModel } from '../Event';
import { EventService } from '../event-service.service';

@Component({
  selector: 'app-movies',
  standalone: false,
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  movieData: EventModel | undefined;
  allMovies: EventModel[] = [];
  filteredMovies: EventModel[] = [];

  constructor(private router: Router, private eventService: EventService) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.movieData = nav.extras.state['movie'];
    }
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((data: EventModel[]) => {
      this.allMovies = data.filter(
        (event: EventModel) => event.Type === 'Movie'
      );
      this.filteredMovies = [...this.allMovies];
    });
  }

  goToDetails(movie: EventModel): void {
    this.router.navigate(['/movies'], { state: { movie } });
  }

  bookTickets(movie: EventModel): void {
    this.router.navigate(['/booking'], { state: { event: movie } });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventModel } from '../Event';
import { EventService } from '../event-service.service';
import { UserStateService } from '../user-state-service.service';

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
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private eventService: EventService,
    private userStateService: UserStateService,
    private activatedRoute: ActivatedRoute
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.movieData = nav.extras.state['movie'];
    }

    // Subscribe to user state to check login status
    this.userStateService.currentUserState.subscribe((userState) => {
      this.isLoggedIn = userState?.isLoggedIn || false;
    });
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((data: EventModel[]) => {
      this.allMovies = data.filter(
        (event: EventModel) => event.Type === 'Movie'
      );
      this.filteredMovies = [...this.allMovies];

      // If no movie data from state, check route params
      if (!this.movieData) {
        this.activatedRoute.paramMap.subscribe((params) => {
          const movieId = params.get('id');
          if (movieId) {
            this.movieData = this.allMovies.find((m) => m.EventID === +movieId);
          }
        });
      }
    });
  }

  goToDetails(movie: EventModel): void {
    this.router.navigate(['/movies', movie.EventID]);
  }

  bookTickets(movie: EventModel): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/booking'], { state: { event: movie } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }

  rateEvent(movie: EventModel): void {
    if (this.isLoggedIn) {
      // Navigate to feedback/rating page with movie data
      this.router.navigate(['/feedback'], { state: { event: movie } });
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/registration']);
    }
  }
}

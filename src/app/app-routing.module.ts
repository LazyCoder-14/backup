import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EventDashboardComponent } from './event-dashboard/event-dashboard.component';
import { MoviesComponent } from './movies/movies.component';
import { EventsComponent } from './events/events.component';
import { SportsComponent } from './sports/sports.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: EventDashboardComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: RegistrationComponent },
  { path: 'signin', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'notifications', component: BookingComponent }, // placeholder
  { path: 'movies', component: MoviesComponent },
  { path: 'events', component: EventsComponent },
  { path: 'sports', component: SportsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

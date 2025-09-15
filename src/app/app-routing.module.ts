import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EventDashboardComponent } from './event-dashboard/event-dashboard.component';
import { MoviesComponent } from './movies/movies.component';
import { EventsComponent } from './events/events.component';
import { SportsComponent } from './sports/sports.component';
import { AdminSideComponent } from './admin-side/admin-side.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { NotificationComponent } from './notification/notification.component';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: EventDashboardComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: RegistrationComponent },
  { path: 'signin', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'notifications', component: NotificationComponent }, // placeholder
  { path: 'movies', component: MoviesComponent },
  { path: 'movies/:id', component: MoviesComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventsComponent },
  { path: 'sports', component: SportsComponent },
  { path: 'sports/:id', component: SportsComponent },
  { path: 'admin_side', component: AdminSideComponent },
  { path: 'user-admin', component: UserAdminComponent },
  { path: 'event-admin', component: EventAdminComponent },
  { path: 'viewTickets', component: ViewTicketsComponent },
  { path: 'feedback', component: FeedbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

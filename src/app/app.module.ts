import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './notification/notification.component';
import { BookingComponent } from './booking/booking.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './navbar/navbar.component';
import { EventDashboardComponent } from './event-dashboard/event-dashboard.component';
import { EventsComponent } from './events/events.component';
import { SportsComponent } from './sports/sports.component';
import { MoviesComponent } from './movies/movies.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';

import { EventService } from './event-service.service';
import { LoginService } from './login.service';
import { UserStateService } from './user-state-service.service';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    BookingComponent,
    RegistrationComponent,
    UserProfileComponent,
    NavbarComponent,
    EventDashboardComponent,
    EventsComponent,
    SportsComponent,
    MoviesComponent,
    HomeComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [EventService, LoginService, UserStateService],
  bootstrap: [AppComponent],
})
export class AppModule {}

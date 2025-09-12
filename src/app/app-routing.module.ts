import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

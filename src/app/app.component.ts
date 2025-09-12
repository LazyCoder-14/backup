import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'Event-Management-System';

  constructor(private router: Router) {}

  goToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  isOnLoginPage(): boolean {
    return this.router.url === '/login';
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
  isUserLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}

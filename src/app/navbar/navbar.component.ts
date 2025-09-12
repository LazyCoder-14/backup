import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService, UserState } from '../user-state-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserState | null = null;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userStateService.currentUserState.subscribe(
      (userState) => {
        this.currentUser = userState;
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  isUserLoggedIn(): boolean {
    return this.currentUser?.isLoggedIn || false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.userStateService.clearUserState();
  }
}

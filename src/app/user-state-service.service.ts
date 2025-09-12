import { Injectable } from '@angular/core';
import User from './user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface UserState extends User {
  isAdmin?: boolean;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userStateSubject = new BehaviorSubject<UserState | null>(null);
  public currentUserState: Observable<UserState | null> =
    this.userStateSubject.asObservable();

  constructor(private router: Router) {
    this.checkUserInLocalStorage();
  }
  private checkUserInLocalStorage(): void {
    const currentUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        console.log('existing user found', userData.name);
        this.setUserState(userData, isAdmin);
      } catch (error) {
        this.clearUserState();
      }
    } else {
      console.log('no existing user found');
    }
  }

  setUserState(userData: User | any, isAdmin: boolean = false): void {
    console.log('Setting user state:', userData.name, 'admin', isAdmin);
    const userState: UserState = {
      ...userData,
      isAdmin: isAdmin,
      isLoggedIn: true,
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAdmin', isAdmin.toString());
    this.userStateSubject.next(userState);
  }

  getUserId(): string | null {
    return this.userStateSubject.value?.userId || null;
  }
  getUserName(): string | null {
    return this.userStateSubject.value?.name || null;
  }

  clearUserState(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    this.userStateSubject.next(null);
    this.router.navigate(['/login']);
  }
}

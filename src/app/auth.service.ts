import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    

private currentUserName: string = 'Vidhanshu';

  constructor() {
    // Load from localStorage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.currentUserName = storedName;
    }
  }

  setCurrentUserName(name: string): void {
    this.currentUserName = name;
    localStorage.setItem('userName', name); // Persist across sessions
  }

  getCurrentUserName(): string {
    return this.currentUserName;
  }

  clearUser(): void {
    this.currentUserName = '';
    localStorage.removeItem('userName');
  }
}
import { Injectable } from '@angular/core';
import User from './user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private login: HttpClient) {}

  strUrl: string = 'http://localhost:3000/user';

  insertUserData(userObj: User) {
    return this.login.post(this.strUrl, userObj);
  }
  // ! method to check duplicate mail
  checkDuplicateEmail(email: string): Observable<any[]> {
    return this.login.get<any[]>(`${this.strUrl}?email=${email}`);
  }

  // ! Get all users
  getAllUsers(): Observable<any[]> {
    return this.login.get<any[]>(this.strUrl);
  }
  validateUser(email: string, password: string): Observable<any[]> {
    return this.login.get<any[]>(
      `${this.strUrl}?email=${email}&password=${password}`
    );
  }

  getUserById(userId: string): Observable<any[]> {
    return this.login.get<any[]>(`${this.strUrl}?userId=${userId}`);
  }

  updateUserDetails(userObj: User): Observable<any> {
    return this.getUserById(userObj.userId).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          const databaseId = users[0].id;
          return this.login.put(`${this.strUrl}/${databaseId}`, userObj);
        } else {
          throw new Error('User not found');
        }
      })
    );
  }

  checkAdmin(email: string, password: string): Observable<any[]> {
    return this.login.get<any[]>(`http://localhost:3000/adminUser?email=${email}&password=${password}`);
  }
}

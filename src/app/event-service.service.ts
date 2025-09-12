import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventModel } from './Event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private dbUrl = 'http://localhost:3000/Events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.dbUrl);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import feedback from './feedback';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackserviceService {
  constructor(private FeedbackserviceService: HttpClient) {}
  eventUrl: string = 'http://localhost:3000/Events';
  strUrl: string = 'http://localhost:3000/Feedback';
  userUrl: string = 'http://localhost:3000/user';

  getAllEvents(): Observable<any> {
    return this.FeedbackserviceService.get(this.eventUrl);
  }

  getAllData(): Observable<any> {
    return this.FeedbackserviceService.get(this.strUrl);
  }

  insertData(feedbackObj: feedback): Observable<any> {
    return this.FeedbackserviceService.post(this.strUrl, feedbackObj);
  }

  //   getAverageRatingByEvent(eventId: number): Observable<number> {
  //   return this.getAllData().pipe(
  //     map((feedbacks: feedback[]) => {
  //       const filtered = feedbacks.filter(f => +f.eventId === eventId);
  //       const avg = filtered.length > 0
  //         ? filtered.reduce((sum, f) => sum + f.rating, 0) / filtered.length
  //         : 0;
  //       return parseFloat(avg.toFixed(1));
  //     })
  //   );
  // }
}

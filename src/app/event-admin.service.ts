import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Event from './event-admin';

@Injectable({
  providedIn: 'root',
})
export class EventAdminService {
  constructor(private eventadminService: HttpClient) {}

  strUrl: string = 'http://localhost:3000/Events';

  getAllData(): Observable<any> {
    return this.eventadminService.get(this.strUrl);
  }
  insertData(eventObj: Event): Observable<any> {
    return this.eventadminService.post(this.strUrl, eventObj);
  }
  updateRecord(eventObj: Event): Observable<any> {
    let strUpdateURL = this.strUrl + '/' + eventObj.id;
    return this.eventadminService.put(strUpdateURL, eventObj);
  }

  deleteRecord(id: string): Observable<any> {
    let deleteRecordURL = this.strUrl + '/' + id;

    return this.eventadminService.delete(deleteRecordURL);
  }
}

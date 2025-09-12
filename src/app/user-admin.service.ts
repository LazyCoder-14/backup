import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Users from './user-admin';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  constructor(private useradminService: HttpClient) {}

  strUrl: string = 'http://localhost:3000/user';

  getAllData(): Observable<any> {
    return this.useradminService.get(this.strUrl);
  }
  insertData(userObj: Users): Observable<any> {
    return this.useradminService.post(this.strUrl, userObj);
  }
  updateRecord(userObj: Users): Observable<any> {
    let strUpdateURL = this.strUrl + '/' + userObj.id;
    return this.useradminService.put(strUpdateURL, userObj);
  }

  deleteRecord(id: string): Observable<any> {
    let deleteRecordURL = this.strUrl + '/' + id;

    return this.useradminService.delete(deleteRecordURL);
  }
}

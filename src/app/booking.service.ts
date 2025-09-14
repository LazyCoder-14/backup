import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
private strUrl='http://localhost:3000/bookings';
  constructor(private http:HttpClient) { }
  createBooking(booking:any){
    return this.http.post(this.strUrl,booking);
  }
  getUserBookings(userId:string){
    return this.http.get<any[]>('${this.strUrl}?UserID=${userId}');
  }
  cancelBooking(id:number,booking:any){
    booking.Status='Canceled';
    return this.http.put('$.{this.strUrl}/${id}',booking);
  }
}

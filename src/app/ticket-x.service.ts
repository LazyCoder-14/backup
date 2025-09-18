import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';

export interface Ticket {
  TicketID: number;
  id: number;
  userName: string;
  userEmail: string;
  EventID: number;
  EventName: string;
  TotalTickets: number;
  image: string;
  BookedTickets: number;
  Price: number;
  Coupons: { code: string; discount: number }[];
  Bookings?: any[];
}
@Injectable({
  providedIn: 'root'
})
export class TicketXService {

  private strUrl = 'http://localhost:3000/Ticket';
  constructor(private http: HttpClient) { }


  getTicketsById(id: number) {
    return this.http.get<Ticket>(`${this.strUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching ticket data:', error);
        return of(null as any);
      })
    );
  }
  updateTickets(data: any): Observable<any> {
    return this.http.put(`${this.strUrl}/${data.id}`, data);
  }
  getAllData(): Observable<any> {
    return this.http.get(this.strUrl);
  }
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.strUrl);
  }
  updateBookingStatus(bookingId: string, booking: any): Observable<any> {
    return this.http.put(`${this.strUrl}/${bookingId}`, booking);
  }
  getTicket(): Observable<any> {
    return this.http.get<any>(this.strUrl);
  }
  getUser(): Observable<any> {
    return this.http.get<any>(this.strUrl); // adjust endpoint
  }
  addBooking(ticketId: number, booking: any): Observable<any> {
    return this.http.get<any>(`${this.strUrl}/${ticketId}`).pipe(
      switchMap(ticket => {
        const updatedTicket = {
          ...ticket,
          Bookings: [...(ticket.Bookings || []), booking],
          BookedTickets: (ticket.BookedTickets || 0) + booking.ticketCount
        };
        return this.http.put(`${this.strUrl}/${ticketId}`, updatedTicket);
      })
    );
  }
  cancelBooking(bookingId: string): Observable<any> {
  return this.http.get<any>(this.strUrl).pipe(
    switchMap((tickets: any[]) => {
      // Find the ticket that contains the booking
      const ticket = tickets.find(t =>
        t.Bookings?.some((b: any) => b.bookingId === bookingId)
      );

      if (!ticket) {
        throw new Error('Booking not found in any ticket');
      }
      const originalBooking = ticket.Bookings.find((b: any) => b.bookingId === bookingId);
      if (!originalBooking) {
        throw new Error('Booking not found inside ticket');
      }
      // ✅ Only restore tickets if booking is not already cancelled
      const shouldRestore = originalBooking.paymentStatus !== 'cancelled';
      const restoredCount = shouldRestore ? originalBooking.ticketCount : 0;
      // Update the booking status
      const updatedBookings = ticket.Bookings.map((b: any) => {
        if (b.bookingId === bookingId) {
          return { ...b, paymentStatus: 'cancelled' };
        }
        return b;
      });

      // Restore ticket count
      const cancelledBooking = ticket.Bookings.find((b: any) => b.bookingId === bookingId);
    

      const updatedTicket = {
        ...ticket,
        BookedTickets: ticket.BookedTickets - restoredCount,
        Bookings: updatedBookings
      };

      return this.http.patch(`${this.strUrl}/${ticket.id}`, updatedTicket);
    })
  );
}

}


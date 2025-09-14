import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Ticket, TicketXService } from '../ticket-x.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStateService } from '../user-state-service.service';

@Component({
  selector: 'app-view-tickets',
  standalone: false,
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css'],
})
export class ViewTicketsComponent implements OnInit {
  bBooking: any;

  goToHomePage() {
    this.route.navigate(['/home']);
  }
  constructor(
    private route: Router,
    private ticketService: TicketXService,
    private http: HttpClient,
    private userStateService: UserStateService
  ) {}
  userEmail: string = '';
  userName: string = ''; // Will be set dynamically from user state
  userBookings: any[] = [];
  tickets: Ticket[] = [];

  ngOnInit(): void {
    // Get current user information from UserStateService
    this.userStateService.currentUserState.subscribe((userState) => {
      if (userState?.isLoggedIn) {
        this.userName = userState.name || '';
        this.userEmail = userState.email || '';
        console.log('Current user:', this.userName);

        // Load tickets after getting user data
        this.loadUserTickets();
      } else {
        console.log('No user logged in, redirecting to login');
        this.route.navigate(['/login']);
      }
    });
  }

  private loadUserTickets(): void {
    this.ticketService.getAllTickets().subscribe((tickets) => {
      this.tickets = tickets;
      const allBookings = tickets.flatMap((ticket) => ticket.Bookings || []);
      this.userBookings = allBookings.filter(
        (b) => b.userName === this.userName
      );
      this.userBookings.sort((a, b) => {
        const dateA = new Date(a.dateOfBooking);
        const dateB = new Date(b.dateOfBooking);
        return dateB.getTime() - dateA.getTime();
      });
      console.log('User bookings loaded:', this.userBookings);
    });
  }

  cancelBooking(bookingId: string): void {
    console.log('Cancel booking:', { bookingId });
    this.ticketService.cancelBooking(bookingId).subscribe({
      next: () => {
        const booking = this.userBookings.find(
          (b) => b.bookingId === bookingId
        );
        if (booking) booking.paymentStatus = 'cancelled';
        alert('Booking cancelled and tickets restored.');
      },
      error: (err) => {
        console.error('Cancellation failed:', err);
        alert('Failed to cancel booking.');
      },
    });
  }

  getDataFromService(this: any) {
    this.ticketService.getAllData().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
      },
      error: (err: any) => alert(JSON.stringify(err)),
      complete: () => console.log('Getting the data from backend is complete'),
    });
  }
}

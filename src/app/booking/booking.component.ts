import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TicketXService, Ticket } from '../ticket-x.service';
import { UserStateService } from '../user-state-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: false,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private http: HttpClient,
    private ticketService: TicketXService,
    private userStateService: UserStateService
  ) {
    // Get event data from navigation state
    const navigation = this.route.getCurrentNavigation();
    if (navigation?.extras?.state?.['event']) {
      this.event = navigation.extras.state['event'];
      this.eventName = this.event.Name;
      this.eventId = this.event.EventID;
      console.log('Constructor: Event data received:', this.event);
      console.log('Constructor: Event name set to:', this.eventName);
    } else {
      console.log('Constructor: No event data in navigation state');
    }
  }
  eventId: string = '';
  eventName: any;
  couponCode: string = '';
  discount: number = 0;
  ticketPrice: number = 0;
  finalPrice: number = 0;
  userEmail: string = '';
  userName: string = '';
  coupons: any[] = [];
  bookingId: any | null = null;
  bookingConfirmation: any = null;
  ticketData = signal<Ticket | null>(null);
  bookingDate: Date = new Date();
  @Input() event: any; //ye event details lega sahil wale component se

  tickets: Ticket[] = [];

  confirmedBookingId: string = '';
  ngOnInit(): void {
    // Get current user information
    this.userStateService.currentUserState.subscribe((userState) => {
      if (userState?.isLoggedIn) {
        this.userName = userState.name || '';
        this.userEmail = userState.email || '';
      }
    });

    // If event data is passed, use it to set event details
    if (this.event) {
      this.eventName = this.event.Name;
      this.eventId = this.event.EventID.toString();
      console.log('Event data received:', this.event);
      console.log('Event name set to:', this.eventName);
      this.ticketPrice = 2000; // Default price, you can adjust this
    } else {
      console.log('No event data found in navigation state');
    }

    const ticketId = 1;
    this.ticketService.getTicketsById(ticketId).subscribe((data: any) => {
      this.ticket = data.Ticket;
      this.editedTicket = { ...data };
    });

    this.ticketService.getTicket().subscribe((data) => {
      this.tickets = data || []; // Ensure tickets is always an array
      if (this.tickets.length > 0) {
        const ticket = data[0];
        // Only update price if not set from event data
        if (!this.ticketPrice) {
          this.ticketPrice = ticket.Price || 2000; // Default price fallback
        }
        this.userBookings = [ticket.Bookings?.slice(-1)[0]];
        this.coupons = ticket.Coupons || [];

        // Don't override eventName if it's already set from navigation state
        if (!this.eventName) {
          this.eventName = ticket.EventName || 'Event Name';
        }
      } else {
        // Set defaults when no tickets data is available
        if (!this.ticketPrice) {
          this.ticketPrice = 2000;
        }
        this.coupons = [];
        if (!this.eventName) {
          this.eventName = 'Event Name';
        }
      }
      this.finalPrice = this.ticketPrice * this.ticketCount;
    });
  }
  userBookings: any[] = [];
  selectedMethod: WritableSignal<string> = signal('');
  processing: WritableSignal<boolean> = signal(false);
  paymentStatus: WritableSignal<string | null> = signal(null);
  cardDetails = signal({
    cardholderName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });
  selectMethod(method: string): void {
    this.selectedMethod.set(method);
    this.paymentStatus.set(null); // Clear status message on method change
    console.log(`Selected payment method: ${method}`);
  }

  processPayment(event?: Event): void {
    if (event) event.preventDefault();
    if (!this.userName) {
      alert('Please enter your name.');
      return;
    }
    if (!this.selectedMethod()) {
      alert('Please select a payment method.');
      return;
    }

    if (
      this.selectedMethod() === 'card' &&
      !this.validateCardDetails(this.cardDetails())
    ) {
      alert('Invalid card details.');
      return;
    }
    const ticketId = this.tickets[0]?.id;
    this.processing.set(true);

    const bookingPayload = {
      bookingId: this.generateBookingId(),
      userName: this.userName,
      userEmail: this.userEmail,
      eventName: this.eventName || 'Event Name',
      eventId: this.eventId,
      ticketCount: this.ticketCount,
      ticketPrice: this.ticketPrice,
      finalPrice: this.finalPrice,
      paymentMethod: this.selectedMethod(),
      paymentStatus: 'Success',
      bookingDate: new Date().toISOString(),
      dateOfBooking: new Date().toISOString(),
    };

    if (ticketId) {
      this.ticketService.addBooking(ticketId, bookingPayload).subscribe({
        next: () => {
          this.bookingConfirmation = bookingPayload;
          this.bDisplayConfirmation = true;
        },
        error: (e) => {
          console.error('Booking failed:', e);
          alert('Payment failed. Please try again.');
        },
        complete: () => {
          this.processing.set(false);
        },
      });
    } else {
      this.processing.set(false);
      alert('Ticket ID not found.');
    }
  }
  closePopup(): void {
    // Remove automatic redirect - user needs to click "View My Tickets" button
    this.bDisplayConfirmation = false;
  }

  viewTickets(): void {
    this.route.navigate(['/viewTickets']); // Redirect to the tickets page after confirmation
  }
  generateBookingId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EVT-${timestamp}-${random}`;
  }
  applyCoupon(): void {
    const matchedCoupon = this.coupons.find(
      (c) => c.code.toLowerCase() === this.couponCode.trim().toLowerCase()
    );
    if (matchedCoupon) {
      this.discount = matchedCoupon.discount;
      this.finalPrice =
        this.ticketPrice * this.ticketCount - this.discount * this.ticketCount;
    } else {
      this.discount = 0;
      this.finalPrice = this.ticketPrice * this.ticketCount;
      alert('Invalid coupon code');
    }
  }
  goToHome() {
    this.route.navigate(['home']);
  }

  bookTickets() {
    this.route.navigate(['tickets']);
  }
  bBooking: boolean = false;
  displaySummary() {
    this.bBooking = true;
  }
  hideSummary() {
    this.bBooking = false;
  }
  bPaymentStatus: boolean = false;

  goToPaymentPage() {
    const ticketsLeft =
      this.tickets && this.tickets[0]
        ? this.tickets[0].TotalTickets - this.tickets[0].BookedTickets
        : 100; // Default fallback
    if (ticketsLeft > 0) {
      this.bPaymentStatus = true;
    } else {
      alert('All tickets are sold');
    }
  }
  ticketCount: number = 1;
  increment(): void {
    const ticketsLeft =
      this.tickets && this.tickets[0]
        ? this.tickets[0].TotalTickets - this.tickets[0].BookedTickets
        : 100; // Default fallback
    if (this.ticketCount < ticketsLeft) {
      this.ticketCount++;
    } else {
      alert('You have already selected the maximum number of tickets');
    }
  }
  decrement(): void {
    if (this.ticketCount > 1) {
      this.ticketCount--;
    }
  }
  getTicketsLeft(): number {
    return this.tickets && this.tickets[0]
      ? this.tickets[0].TotalTickets - this.tickets[0].BookedTickets
      : 100; // Default fallback
  }

  getDataFromService() {
    this.ticketService.getAllData().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
      },
      error: (err: any) => alert(JSON.stringify(err)),
      complete: () => console.log('Getting the data from backend is complete'),
    });
  }
  private validateCardDetails(details: any): boolean {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expDateRegex = /^(0[1-9]|1[0-2])$/;
    const expYearRegex = /^[0-9]{2}$/;
    const cvcRegex = /^[0-9]{3,4}$/;
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!details.cardholderName || details.cardholderName.trim() === '') {
      console.warn('Cardholder name is required.');
      return false;
    }
    if (!cardNumberRegex.test(details.cardNumber.replace(/[- ]/g, ''))) {
      console.warn('Invalid card number format.');
      return false;
    }
    if (
      !expDateRegex.test(details.expMonth) ||
      !expYearRegex.test(details.expYear)
    ) {
      console.warn('Invalid expiration date format.');
      return false;
    }
    const expYear = parseInt(details.expYear, 10);
    const expMonth = parseInt(details.expMonth, 10);
    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      console.warn('Expiration date is in the past.');
      return false;
    }
    if (!cvcRegex.test(details.cvc)) {
      console.warn('Invalid CVC format.');
      return false;
    }
    return true;
  }
  bDisplayConfirmation: boolean = false;
  displayConfirmation() {
    this.bDisplayConfirmation = true;
  }
  ticket: any;
  isEditing = false;
  editedTicket: any = {};
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    this.ticketService
      .updateTickets(this.editedTicket)
      .subscribe((updated: any) => {
        this.ticket = updated;
        this.isEditing = false;
      });
  }
  saveBookingDirectly(): void {
    if (!this.userName || this.ticketCount < 1) {
      alert('Please enter your name and select at least one ticket.');
      return;
    }

    this.processing.set(true);

    const booking = {
      bookingId: this.generateBookingId(),
      userName: this.userName,
      userEmail: this.userEmail,
      eventName: this.eventName || 'Event Name',
      eventId: this.eventId,
      ticketCount: this.ticketCount,
      ticketPrice: this.ticketPrice,
      finalPrice: this.finalPrice,
      paymentStatus: 'Success',
      bookingDate: new Date().toISOString(),
      dateOfBooking: new Date().toISOString(),
    };

    const ticketId = this.tickets[0]?.EventID;
    if (!ticketId) {
      this.processing.set(false);
      alert('Event ID not found.');
      return;
    }

    this.ticketService.addBooking(ticketId, booking).subscribe({
      next: () => {
        this.processing.set(false);
        this.bookingConfirmation = booking;
        this.bDisplayConfirmation = true;
      },
      error: (err) => {
        this.processing.set(false);
        console.error('Booking save error:', err);
        alert('Failed to save booking. Please try again.');
      },
    });
  }

  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  currentSlideIndex = signal(0);
  slides = signal([
    {
      title: '20% OFF',
      description: 'Use code CONCERT20 at checkout!',
      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    },
    {
      title: 'BOGO Special',
      description: 'Get one free ticket when you buy one!',
      background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
    },
    {
      title: 'Group Discount',
      description: 'Save 15% on bookings of 4 or more tickets.',
      background: 'linear-gradient(to right, #14b8a6, #3b82f6)',
    },
    {
      title: 'Early Bird Offer',
      description: 'Get 10% off for bookings made before Nov 1st!',
      background: 'linear-gradient(to right, #22c55e, #06b6d4)',
    },
    {
      title: 'Welcome Discount',
      description: 'New users save 25% on their first booking!',
      background: 'linear-gradient(to right, #a855f7, #f59e0b)',
    },
  ]);

  private autoPlayInterval: any;

  ngAfterViewInit() {
    this.updateCarousel();
    this.startAutoPlay();
  }

  updateCarousel() {
    if (this.carouselTrack) {
      const slideWidth =
        this.carouselTrack.nativeElement.children[0].getBoundingClientRect()
          .width;
      this.carouselTrack.nativeElement.style.transform = `translateX(-${
        slideWidth * this.currentSlideIndex()
      }px)`;
    }
  }

  moveToNextSlide() {
    const newIndex = (this.currentSlideIndex() + 1) % this.slides().length;
    this.currentSlideIndex.set(newIndex);
    this.updateCarousel();
  }

  moveToPrevSlide() {
    const newIndex =
      (this.currentSlideIndex() - 1 + this.slides().length) %
      this.slides().length;
    this.currentSlideIndex.set(newIndex);
    this.updateCarousel();
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
    this.updateCarousel();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.moveToNextSlide();
    }, 5000);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FeedbackserviceService } from '../feedbackservice.service';
import feedback from '../feedback';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStateService } from '../user-state-service.service';
@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  bInsertFeedback: boolean = false;
  addFeedback!: FormGroup;
  currentEventData: any = null;
  currentUser: any = null;
  isLoggedIn: boolean = false;

  faces = ['', '😠', '☹️', '😐', '🙂', '😄'];
  captions = ['', 'Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];

  spinning = 0;

  onSmileyClick(v: number): void {
    this.setRating(v);

    this.spinning = v;

    setTimeout(() => (this.spinning = 0), 700);
  }

  setRating(v: number): void {
    this.addFeedback.get('rating')?.setValue(v);
  }

  get ratingCtrl() {
    return this.addFeedback.get('rating');
  }

  onClose(): void {
    this.route.navigate(['/']);
  }

  onCancel(): void {
    this.route.navigate(['/']);
  }

  constructor(
    private fb: FormBuilder,
    private Feedbackservice: FeedbackserviceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private userStateService: UserStateService
  ) {
    this.addFeedback = this.fb.group({
      feedbackId: [Math.floor(Math.random() * 1000000)], // Generate random number ID
      eventId: [''],
      userId: [''],
      userName: [''],
      rating: ['', [Validators.required]],
      comments: [''],
      submittedTimestamp: [''],
    });

    // Subscribe to user state to get current user data
    this.userStateService.currentUserState.subscribe((userState) => {
      this.isLoggedIn = userState?.isLoggedIn || false;
      if (userState?.isLoggedIn) {
        this.currentUser = userState;
        this.addFeedback.patchValue({
          userId: userState.userId,
          userName: userState.name,
        });
      }
    });
  }

  goToFeedbackPage() {
    const currentUserId = this.addFeedback.get('userId')?.value;
    const currentUserName = this.addFeedback.get('userName')?.value;
    const currentEventId = this.addFeedback.get('eventId')?.value;

    console.log('goToFeedbackPage - preserving values:', {
      currentUserId,
      currentUserName,
      currentEventId,
    });

    this.addFeedback.reset({
      feedbackId: Math.floor(Math.random() * 1000000), // Generate new numeric ID
      eventId: currentEventId || '',
      userId: currentUserId || '',
      userName: currentUserName || '',
      rating: '',
      comments: '',
      submittedTimestamp: '',
    });

    console.log('goToFeedbackPage - after reset:', this.addFeedback.value);
    this.bInsertFeedback = true;
  }
  AddDataInBackend() {
    let feedbackId = this.addFeedback.get(['feedbackId'])?.value;
    let eventId = this.addFeedback.get(['eventId'])?.value;
    let userId = this.addFeedback.get(['userId'])?.value;
    let userName = this.addFeedback.get(['userName'])?.value;
    let rating = this.addFeedback.get(['rating'])?.value;
    let comments = this.addFeedback.get(['comments'])?.value;
    let submittedTimestamp = this.addFeedback.get([
      'submittedTimestamp',
    ])?.value;

    console.log('Submitting feedback with values:', {
      feedbackId,
      eventId,
      userId,
      userName,
      rating,
      comments,
      submittedTimestamp,
    });

    let feedbackRec: feedback = new feedback(
      feedbackId,
      eventId,
      userId,
      userName,
      rating,
      comments,
      submittedTimestamp
    );

    this.Feedbackservice.insertData(feedbackRec).subscribe({
      next: (data) => {
        feedbackId = Math.floor(Math.random() * 1000000); // Generate new numeric ID
        alert('Comments for this event accepted successfully..');
        this.route.navigate(['/']);
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('insert operation successful'),
    });
  }

  // feedbackLst!: feedback[];
  // getfeedbackFromTable() {
  //   this.Feedbackservice.getAllData().subscribe({
  //     next: (data) => {
  //       this.feedbackLst = data;
  //     },
  //     error: (err) => alert(JSON.stringify(err)),
  //     complete: () =>
  //       console.log('getting data from feedback table is complete'),
  //   });
  // }

  ngOnInit(): void {
    console.log('FeedbackComponent ngOnInit called');

    // Check if user is logged in first
    if (!this.isLoggedIn) {
      alert('You must be logged in to rate events');
      this.route.navigate(['/registration']);
      return;
    }

    // Get event data from router state (passed from rating button)
    const navigation = this.route.getCurrentNavigation();
    console.log('Navigation object:', navigation);

    const eventData = navigation?.extras?.state?.['event'];
    console.log('Event data from navigation state:', eventData);

    // Also try to get from history state as fallback
    const historyState = history.state;
    console.log('History state:', historyState);
    const eventFromHistory = historyState?.event;

    const finalEventData = eventData || eventFromHistory;
    console.log('Final event data to use:', finalEventData);

    // Auto-open the feedback form first (resets form)
    this.goToFeedbackPage();

    if (finalEventData) {
      // Store event data and set form values
      this.currentEventData = finalEventData;
      const eventId = finalEventData.EventID || finalEventData.id;
      console.log('Setting eventId to:', eventId);

      this.addFeedback.patchValue({
        eventId: eventId,
        submittedTimestamp: new Date().toISOString(),
      });
    } else {
      // Fallback to route parameter if no state data
      const eventIdFromRoute =
        this.activatedRoute.snapshot.paramMap.get('eventId');
      console.log('EventId from route param:', eventIdFromRoute);

      this.addFeedback.patchValue({
        eventId: eventIdFromRoute,
        submittedTimestamp: new Date().toISOString(),
      });
    }

    // Ensure user data is set after form reset
    if (this.currentUser) {
      console.log('Setting user data:', this.currentUser);
      this.addFeedback.patchValue({
        userId: this.currentUser.userId,
        userName: this.currentUser.name,
      });
    }

    // Log final form values
    setTimeout(() => {
      console.log('Final form values:', this.addFeedback.value);
    }, 100);
  }
}

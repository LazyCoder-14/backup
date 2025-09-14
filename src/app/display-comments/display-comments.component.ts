import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FeedbackserviceService } from '../feedbackservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import feedback from '../feedback';
import { filter } from 'rxjs';

@Component({
  selector: 'app-display-comments',
  standalone: false,
  templateUrl: './display-comments.component.html',
  styleUrl: './display-comments.component.css',
})
export class DisplayCommentsComponent implements OnChanges {
  selectedEvent: any;

  constructor(private FeedbackService: FeedbackserviceService) {}

  // @Input() eventId!: any;

  // feedbackLst!: feedback[];

  //  ngOnChanges(): void {
  //    this.FeedbackService.getAllData().subscribe({
  //      next: (data: feedback[]) => {
  //        this.feedbackLst = data.filter(filter => filter.eventId == this.eventId);
  //      },
  //      error: (err: any) => alert(JSON.stringify(err)),
  //      complete: () =>
  //        console.log('getting data from feedback table is complete'),
  //    });
  //  }

  // averageRating: number = 0;

  // ngOnChanges(): void {
  //   this.FeedbackService.getAllData().subscribe({
  //     next: (data: feedback[]) => {
  //       this.feedbackLst = data.filter(f => +f.eventId === +this.eventId);
  //     },
  //     error: (err: any) => alert(JSON.stringify(err)),
  //     complete: () => console.log('Feedback data loaded')
  //   });

  //   this.FeedbackService.getAverageRatingByEvent(+this.eventId).subscribe({
  //     next: (avg: number) => this.averageRating = avg,
  //     error: (err: any) => console.error('Error fetching average rating:', err)
  //   });
  // }

  // @Input() eventId!: number;
  // averageRating: number = 0;
  // voteCount: number = 0;
  // feedbackLst: feedback[] = [];
  //   positiveFeedbackLst: feedback[] = [];
  //   negativeFeedbackLst: feedback[] = [];

  //  latestComments: feedback[] = [];
  //   maxLatest = 30;

  // ngOnChanges(): void {
  //   if (this.eventId) {
  //     this.FeedbackService.getAllData().subscribe({
  //       next: (data: feedback[]) => {
  //         const filtered = data
  //           .filter(f => +f.eventId === +this.eventId)
  //           .filter(f => f.comments && f.comments.trim() !== '');
  //         this.feedbackLst = filtered;

  //         if (filtered.length > 0) {
  //           const total = filtered.reduce((sum, f) => sum + f.rating, 0);
  //           this.averageRating = parseFloat((total / filtered.length).toFixed(1));
  //           this.voteCount = filtered.length;
  //         } else {
  //           this.averageRating = 0;
  //           this.voteCount = 0;
  //         }
  // this.positiveFeedbackLst = filtered.filter(f => Number(f.rating) >= 3);
  //         this.negativeFeedbackLst = filtered.filter(f => Number(f.rating) <= 2);
  //       },
  //     });
  //   }
  // }

  //   timeAgo(iso?: string): string {
  //     if (!iso) return '-';
  //     const now = new Date();
  //     const then = new Date(iso);
  //     const diff = now.getTime() - then.getTime();
  //     if (diff < 0) return 'Just now';

  //     const sec =Math.floor(diff / 1000);
  //     const min =Math.floor(sec / 60);
  //     const hr  =Math.floor (min / 60);
  //     const day =Math.floor(hr / 24);
  //     const wk  =Math.floor (day / 7);
  //     const mo  = Math.floor(day / 30);
  //     const yr  =Math.floor (day / 365);

  //     if (sec < 30) return 'Just now';
  //     if (sec < 60) return `${sec}s ago`;
  //     if (min < 60) return `${min} ${min === 1 ? 'min' : 'mins'} ago`;
  //     if (hr  < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} ago`;
  //     if (day < 7)  return `${day} ${day === 1 ? 'day' : 'days'} ago`;
  //     if (wk  < 5)  return `${wk} ${wk === 1 ? 'week' : 'weeks'} ago`;
  //     if (mo  < 12) return `${mo} ${mo === 1 ? 'month' : 'months'} ago`;
  //     return `${yr} ${yr === 1 ? 'year' : 'years'} ago`;
  //   }

  @Input() eventId!: number;

  averageRating = 0;
  voteCount = 0;

  // master filtered (by event + non-empty) and sorted (latest first)
  filtered: feedback[] = [];

  // latest positive/negative (no chunk arrays; we’ll use i%3 in HTML)
  positiveLatest: feedback[] = [];
  negativeLatest: feedback[] = [];

  // expanded state for “…more” (keyed per item)
  // private expanded = new Set<string>();

  // constructor(private FeedbackService: FeedbackserviceService) {}
  // Add near your other fields:

  starValues = [5, 4, 3, 2, 1];
  ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingPercents: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Helper to compute distribution from a list
  private computeDistribution(list: feedback[]): void {
    // Reset counts to start fresh for this event
    this.ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const f of list) {
      const r = Number(f.rating);
      if (r >= 1 && r <= 5) {
        this.ratingCounts[r]++;
      }
    }
    const total = Object.values(this.ratingCounts).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const s of this.starValues) {
        this.ratingPercents[s] = Math.round(
          (this.ratingCounts[s] / total) * 100
        );
      }
    } else {
      this.ratingPercents = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
  }

  ngOnChanges(): void {
    console.log('ngOnChanges called with eventId:', this.eventId);
    if (!this.eventId) return;

    this.FeedbackService.getAllData().subscribe({
      next: (data: feedback[]) => {
        console.log('Received feedback data:', data);
        console.log('Filtering for eventId:', this.eventId);

        // 1) Filter this event + non-empty comments
        const filtered = (data || [])
          .filter((f) => +f.eventId === +this.eventId)
          .filter((f) => f.comments && f.comments.trim() !== '');

        console.log('Filtered comments for this event:', filtered);

        // 2) Sort by latest (desc)
        filtered.sort(
          (a, b) =>
            this.toTime(b.submittedTimestamp || b.createdAt) -
            this.toTime(a.submittedTimestamp || a.createdAt)
        );

        this.filtered = filtered;

        // 3) Build latest positive / negative (tweak thresholds if needed)
        this.positiveLatest = filtered.filter((f) => Number(f.rating) >= 3);

        this.negativeLatest = filtered.filter((f) => Number(f.rating) <= 2);

        // 4) Summary from all filtered
        if (filtered.length) {
          const total = filtered.reduce(
            (s, f) => s + (Number(f.rating) || 0),
            0
          );
          this.averageRating = parseFloat((total / filtered.length).toFixed(1));
          this.voteCount = filtered.length;
          this.computeDistribution(filtered);
        } else {
          this.averageRating = 0;
          this.voteCount = 0;

          this.ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          this.ratingPercents = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        }
      },
      error: (err) => console.error('Failed to load feedback', err),
    });
  }

  private toTime(iso?: string): number {
    return iso ? new Date(iso).getTime() : 0;
  }

  // “time ago” label
  timeAgo(iso?: string): string {
    if (!iso) return '-';
    const now = new Date();
    const then = new Date(iso);
    const diff = now.getTime() - then.getTime();
    if (diff < 0) return 'Just now';

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const wk = Math.floor(day / 7);
    const mo = Math.floor(day / 30);
    const yr = Math.floor(day / 365);

    if (sec < 30) return 'Just now';
    if (sec < 60) return `${sec}s ago`;
    if (min < 60) return `${min}  mins ago`;
    if (hr < 24) return `${hr}  hours ago`;
    if (day < 7) return `${day}  days ago`;
    if (wk < 5) return `${wk} weeks ago`;
    if (mo < 12) return `${mo} months ago`;
    return `${yr} years ago`;
  }

  // ---- “…more / Show less” helpers ----

  // private key(item: feedback, index: number, section: 'pos' | 'neg'): string {
  //     return item.feedbackId ? `${section}-${item.feedbackId}` : `${section}-${index}`;
  //   }

  //   isExpanded(item: feedback, index: number, section: 'pos' | 'neg'): boolean {
  //     return this.expanded.has(this.key(item, index, section));
  //   }

  //   toggleExpand(item: feedback, index: number, section: 'pos' | 'neg'): void {
  //     const k = this.key(item, index, section);
  //     if (this.expanded.has(k)) this.expanded.delete(k);
  //     else this.expanded.add(k);
  //   }

  //   hasLongComment(text?: string): boolean {
  //     return (text?.length || 0) > 160; // tweak threshold as you like
  //   }
}

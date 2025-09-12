export interface EventModel {
Venue: any;
  EventID: number;
  Name: string;
  Category: string;
  Type: 'Movie' | 'Event' | 'Sports';
  Location: string;
  Date: string;
  OrganizerID: string;
  PosterURL: string;
  Tagline: string;
  Language: string;
  Format: string;
  Showtime: string;
}

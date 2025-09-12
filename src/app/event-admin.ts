export default class Event {
  id!: string;
  Name!: string;
  Category!: string;
  Location!: string;
  Showtime!: string;
  Date!: string;
  Type!: string;
  OrganizerID!: string;
  Format!: string;
  Language!: string;
  Tagline!: string;
  PosterURL?: string;

  constructor(
    id: string,
    Name: string,
    Category: string,
    Location: string,
    Showtime: string,
    Date: string,
    Type: string,
    OrganizerID: string,
    Format: string,
    Language: string,
    Tagline: string,
    PosterURL?: string
  ) {
    this.id = id;
    this.Name = Name;
    this.Category = Category;
    this.Location = Location;
    this.Showtime = Showtime;
    this.Date = Date;
    this.Type = Type;
    this.OrganizerID = OrganizerID;
    this.Format = Format;
    this.Language = Language;
    this.Tagline = Tagline;
    this.PosterURL = PosterURL;
  }
}

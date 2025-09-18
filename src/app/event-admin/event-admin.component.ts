import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Event from '../event-admin';
import { Router } from '@angular/router';
import { EventAdminService } from '../event-admin.service';

@Component({
  selector: 'app-event-admin',
  standalone: false,
  templateUrl: './event-admin.component.html',
  styleUrl: './event-admin.component.css',
})
export class EventAdminComponent {
  eventList!: Event[];
  addOrEditForm!: FormGroup;
  searchQuery: string = '';
  filteredEventList!: Event[];
  bDisplayInsertRecordForm: boolean = false;
  bDisplayEditForm: boolean = false;
  bDisplayEventTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventadminService: EventAdminService,
    private router: Router
  ) {
    this.addOrEditForm = this.fb.group({
      id: [''],
      Name: [''],
      Category: [''],
      Location: [''],
      Showtime: [''],
      Date: [''],
      Type: [''],
      OrganizerID: [''],
      Format: [''],
      Language: [''],
      Tagline: [''],
      PosterURL: [''],
    });

    this.addOrEditForm.get('id')?.valueChanges.subscribe((enteredId: string) => {
        if (this.bDisplayEditForm && enteredId) {
          const matchedEvent = this.eventList?.find(event => event.id === enteredId);
          if (matchedEvent) {
            this.addOrEditForm.patchValue({
              
              Name: matchedEvent.Name,
              Category: matchedEvent.Category,
              Location: matchedEvent.Location,
              Showtime: matchedEvent.Showtime,
              Date: matchedEvent.Date,
              Type: matchedEvent.Type,
              OrganizerID: matchedEvent.OrganizerID,
              Format: matchedEvent.Format,
              Language: matchedEvent.Language,
              Tagline: matchedEvent.Tagline,
              PosterURL: matchedEvent.PosterURL
            });
          }else {
          this.addOrEditForm.patchValue({
           
      Name: '',
      Category: '',
      Location: '',
      Showtime: '',
      Date: '',
      Type: '',
      OrganizerID: '',
      Format: '',
      Language: '',
      Tagline: '',
      PosterURL: ''
      });
    }
        }
      });
  }

  get id() {
    return this.addOrEditForm.get('id');
  }
  get Name() {
    return this.addOrEditForm.get('Name');
  }
  get Category() {
    return this.addOrEditForm.get('Category');
  }
  get Location() {
    return this.addOrEditForm.get('Location');
  }
  get Date() {
    return this.addOrEditForm.get('Date');
  }
  get OrganizerID() {
    return this.addOrEditForm.get('OrganizerID');
  }
  get Showtime() {
    return this.addOrEditForm.get('Showtime');
  }
  get Format() {
    return this.addOrEditForm.get('Format');
  }
  get Language() {
    return this.addOrEditForm.get('Language');
  }
  get Tagline() {
    return this.addOrEditForm.get('Tagline');
  }
  get PosterURL() {
    return this.addOrEditForm.get('PosterURL');
  }
  get Type() {
    return this.addOrEditForm.get('Type');
  }

 
  getDataFromService() {
    this.bDisplayEventTable = !this.bDisplayEventTable;
    if (this.bDisplayEventTable) {
      this.eventadminService.getAllData().subscribe({
        next: (data) => {
          this.eventList = data;
          this.filteredEventList = data;
        },
        error: (err) => alert(JSON.stringify(err)),
        complete: () => console.log('Data fetched from backend'),
      });
    } else {
      this.eventList = [];
      this.filteredEventList = [];
    }
  }

  displayAddForm() {
    this.bDisplayInsertRecordForm = !this.bDisplayInsertRecordForm;
    if (this.bDisplayInsertRecordForm) {
      this.addOrEditForm.reset({
        id: '',
        Name: '',
        Category: '',
        Location: '',
        Showtime: '',
        Date: '',
        Type: '',
        OrganizerID: '',
        Format: '',
        Language: '',
        Tagline: '',
        PosterURL: ''
      });
    }
  }

  filterEvents() {
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      this.filteredEventList = this.eventList;
    } else {
      this.filteredEventList = this.eventList.filter(
        (event) =>
          event.Type.toLowerCase().includes(query) ||
          event.Name.toLowerCase().includes(query) ||
          event.id.toLowerCase().includes(query) ||
          event.OrganizerID.toLowerCase().includes(query) ||
          event.Category.toLowerCase().includes(query)
      );
    }
  }

  toggleEditForm() {
    this.bDisplayEditForm = !this.bDisplayEditForm;
    if (!this.eventList || this.eventList.length === 0) {
      this.eventadminService.getAllData().subscribe({
        next: (data) => {
          this.eventList = data;
          console.log('Event list loaded for edit form');
        },
        error: (err) => alert(JSON.stringify(err)),
        complete: () => console.log('Event list fetched complete'),
      });
    }
  }

  AddDataInBackend() {
    const eventadminRecord = new Event(
      this.id?.value,
      this.Name?.value,
      this.Category?.value,
      this.Location?.value,
      this.Showtime?.value,
      this.Date?.value,
      this.Type?.value,
      this.OrganizerID?.value,
      this.Format?.value,
      this.Language?.value,
      this.Tagline?.value,
      this.PosterURL?.value
    );

    this.eventadminService.insertData(eventadminRecord).subscribe({
      next: () => {
        alert('Event Details Added !');
        this.getDataFromService();
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('Event Details Added !'),
    });

    this.bDisplayInsertRecordForm = false;
  }

  editDataInService() {
    const eventObj = new Event(
      this.id?.value,
      this.Name?.value,
      this.Category?.value,
      this.Location?.value,
      this.Showtime?.value,
      this.Date?.value,
      this.Type?.value,
      this.OrganizerID?.value,
      this.Format?.value,
      this.Language?.value,
      this.Tagline?.value,
      this.PosterURL?.value
    );

    this.eventadminService.updateRecord(eventObj).subscribe({
      next: () => {
        alert('Event Details Updated !');
        this.getDataFromService();},
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('Event Details Updated!'),
    });

    this.bDisplayEditForm = false;
  }

  deleteRecord(id: string) {
    this.eventadminService.deleteRecord(id).subscribe({
      next: () => {
        this.bDisplayEventTable = true;

        this.eventadminService.getAllData().subscribe({
          next: (data) => {
            alert('Event Details Deleted !');
            this.filteredEventList = data;
            console.log('Event Details Deleted!');
          },
          error: (err) => alert(JSON.stringify(err)),
          complete: () => console.log('Deleted the Event'),
        });
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('Deleted the Event'),
    });
  }
}

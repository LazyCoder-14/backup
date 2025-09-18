import { Component, Inject } from '@angular/core';
import { UserAdminService } from '../user-admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Users from '../user-admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admin',
  standalone: false,
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css',
})
export class UserAdminComponent {
  userList!: Users[];
  addOrEditForm!: FormGroup;
  searchUserId: string = '';
  filteredUserList!: Users[];
  bDisplayInsertRecordForm: boolean = false;
  bDisplayEditForm: boolean = false;
  bDisplayUserTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private useradminService: UserAdminService,
    private router: Router
  ) {
    this.addOrEditForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
    });

    this.addOrEditForm.get('id')?.valueChanges.subscribe((enteredId: string) => {
        if (this.bDisplayEditForm && enteredId) {
          const matchedUser = this.userList?.find(user => user.id === enteredId);
          if (matchedUser) {
            this.addOrEditForm.patchValue({
              name: matchedUser.name,
              email: matchedUser.email,
              contactNumber: matchedUser.contactNumber,
            });
          } else {
            this.addOrEditForm.patchValue({
              name: '',
              email: '',
              contactNumber: '',
            });
          }
        }
      });
  }

  get id() {
    return this.addOrEditForm.get('id');
  }
  get name() {
    return this.addOrEditForm.get('name');
  }
  get email() {
    return this.addOrEditForm.get('email');
  }
  get contactNumber() {
    return this.addOrEditForm.get('contactNumber');
  }

  getDataFromService() {
    this.bDisplayUserTable = !this.bDisplayUserTable;
    if (this.bDisplayUserTable) {
      this.useradminService.getAllData().subscribe({
        next: (data) => {
          this.userList = data;
          this.filteredUserList = data;
        },
        error: (err) => alert(JSON.stringify(err)),
        complete: () => console.log('Data fetched from backend'),
      });
    } else {
      this.userList = [];
      this.filteredUserList = [];
    }
  }


  displayAddForm() {
    this.bDisplayInsertRecordForm = !this.bDisplayInsertRecordForm;
    if (this.bDisplayInsertRecordForm) {
      this.addOrEditForm.reset({
        id: '',
        name: '',
        email: '',
        contactNumber: '',
      });
    }
  }
  filterUsersById() {
    const query = this.searchUserId.trim().toLowerCase();

    if (query === '') {
      this.filteredUserList = this.userList;
    } else {
      this.filteredUserList = this.userList.filter((user) =>
        user.id.toLowerCase().includes(query)
      );
    }
  }

  toggleEditForm() {
    this.bDisplayEditForm = !this.bDisplayEditForm;
    if (!this.userList || this.userList.length === 0) {
      this.useradminService.getAllData().subscribe({
        next: (data) => {
          this.userList = data;
          console.log('User list loaded for edit form');
        },
        error: (err) => alert(JSON.stringify(err)),
        complete: () => console.log('User list fetch complete'),
      });
    }
  }

  AddDataInBackend() {
    const useradminRecord = new Users(
      this.id?.value,
      this.name?.value,
      this.email?.value,
      this.contactNumber?.value
    );

    this.useradminService.insertData(useradminRecord).subscribe({
      next: () => {
        alert('User Details Added !');
        this.getDataFromService();
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('User Details Added !'),
    });

    this.bDisplayInsertRecordForm = false;
  }

  editDataInService() {
    const userObj = new Users(
      this.id?.value,
      this.name?.value,
      this.email?.value,
      this.contactNumber?.value
    );

    this.useradminService.updateRecord(userObj).subscribe({
      next: () => {
        alert('User Details Updated !');
        this.getDataFromService();
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('User Details Updated!'),
    });

    this.bDisplayEditForm = false;
  }

  deleteRecord(id: string) {
    this.useradminService.deleteRecord(id).subscribe({
      next: () => {
        this.bDisplayUserTable = true;

        this.useradminService.getAllData().subscribe({
          next: (data) => {
            alert('User Details Deleted !');
            this.filteredUserList = data;
            console.log('User Details Deleted!');
          },
          error: (err) => alert(JSON.stringify(err)),
          complete: () => console.log('Deleted the User'),
        });
      },
      error: (err) => alert(JSON.stringify(err)),
      complete: () => console.log('Deleted the User'),
    });
  }
}

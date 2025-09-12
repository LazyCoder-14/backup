import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: any;
  isEditMode: boolean = false;
  isPasswordMode: boolean = false;
  activeTab = 0;
  tabs = ['Profile', 'Edit', 'Password'];

  profileFields = [
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'contactNumber' },
    { label: 'Age', key: 'age' },
    { label: 'Gender', key: 'gender' },
  ];

  formFields = [
    { label: 'Name', key: 'name', type: 'text', placeholder: 'Enter name' },
    {
      label: 'Phone',
      key: 'contactNumber',
      type: 'tel',
      placeholder: 'Enter phone',
    },
    { label: 'Age', key: 'age', type: 'number', placeholder: 'Enter age' },
  ];

  passwordFields = [
    { key: 'currentPassword', placeholder: 'Current Password' },
    { key: 'newPassword', placeholder: 'New Password' },
    { key: 'confirmPassword', placeholder: 'Confirm Password' },
  ];

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.createProfileForm();
    this.createPasswordForm();
  }

  loadCurrentUser(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      console.log('Current user:', this.currentUser);
    } else {
      // Redirect to login if no user found
      this.router.navigate(['/login']);
    }
  }

  createProfileForm(): void {
    this.profileForm = this.fb.group({
      name: [
        this.currentUser?.name || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      contactNumber: [
        this.currentUser?.contactNumber || '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      age: [
        this.currentUser?.age || '',
        [Validators.min(1), Validators.max(120)],
      ],
      address: [this.currentUser?.address || ''],
      gender: [this.currentUser?.gender || ''],
    });
  }

  createPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.isPasswordMode = false;

    if (!this.isEditMode) {
      this.createProfileForm();
    }
  }

  togglePasswordMode(): void {
    this.isPasswordMode = !this.isPasswordMode;
    this.isEditMode = false;

    if (!this.isPasswordMode) {
      this.passwordForm.reset();
    }
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedData = {
        ...this.currentUser,
        ...this.profileForm.value,
      };

      this.loginService.updateUserDetails(updatedData).subscribe({
        next: (response) => {
          // Update localStorage with new data
          localStorage.setItem('currentUser', JSON.stringify(updatedData));
          this.currentUser = updatedData;
          this.isEditMode = false;
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update profile. Please try again.');
        },
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      // Verify current password
      if (currentPassword !== this.currentUser.password) {
        alert('Current password is incorrect!');
        return;
      }

      const updatedData = {
        ...this.currentUser,
        password: newPassword,
      };

      this.loginService.updateUserDetails(updatedData).subscribe({
        next: (response) => {
          localStorage.setItem('currentUser', JSON.stringify(updatedData));
          this.currentUser = updatedData;
          this.isPasswordMode = false;
          this.passwordForm.reset();
          alert('Password updated successfully!');
        },
        error: (err) => {
          console.error('Password update error:', err);
          alert('Failed to update password. Please try again.');
        },
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.createProfileForm(); // Reset form to original values
  }

  cancelPasswordChange(): void {
    this.isPasswordMode = false;
    this.passwordForm.reset();
  }

  setTab(index: number) {
    this.activeTab = index;
  }
}

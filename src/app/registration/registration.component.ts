import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import User from '../user';
import { UserStateService } from '../user-state-service.service';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  // ! Flag to toggle between Sign Up and Sign In forms
  showRegistrationForm: boolean = false;
  signUpForm!: FormGroup;
  signInForm!: FormGroup;
  showToast = false;

  hideSignInPassword: boolean = true;
  hideSignUpPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    // ! Define the Sign Up form structure and validators
    this.signUpForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // ! Define the Sign In form structure and validators
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSignUpClick(): void {
    this.showRegistrationForm = true;
  }

  onSignInClick(): void {
    this.showRegistrationForm = false;
  }

  // ! Handle Sign Up form submission
  onSignUpSubmit(): void {
    // ! Check if the form is valid
    if (!this.signUpForm.valid) {
      console.log('Sign Up form is invalid');
      return;
    }

    // ! Get the data from signup form

    // * method 1 using formGroup.get('controlName').value
    // let userId = this.signUpForm.get(['userId'])?.value;
    // let userName = this.signUpForm.get(['name'])?.value;
    // let userEmail = this.signUpForm.get(['email'])?.value;
    // let userPhone = this.signUpForm.get(['phone'])?.value;
    // let userPassword = this.signUpForm.get(['password'])?.value;

    // * method 2 using formGroup.value

    // let formData = this.signUpForm.value;

    // let userObj: User = new User(
    //   formData.userId,
    //   formData.name,
    //   formData.email,
    //   formData.phone,
    //   formData.password
    // );

    //* method 3 using destructuring
    const { userId, name, email, phone, password } = this.signUpForm.value;

    // ! best pratice to store email in lowercase to avoid case sensitivity issues
    const lowercaseEmail = email.toLowerCase().trim();
    // ! create an object with the obtained data
    let userObj = new User(userId, name, lowercaseEmail, phone, password);

    this.loginService.checkDuplicateEmail(lowercaseEmail).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length > 0) {
          this.showToast = true;
        } else {
          this.registerUser(userObj);
        }
      },
    });
  }

  private registerUser(userObj: User): void {
    // ! call the service method to send the data to the db
    this.loginService.insertUserData(userObj).subscribe({
      next: () => {
        alert('Sign Up Successful');
        this.signUpForm.reset();
        this.showRegistrationForm = false;
        this.hideSignInPassword = true;
      },
      error: (err) => alert('Something went wrong!!'),
      complete: () => console.log('Sign Up Completed'),
    });
  }

  //  ! Handle Sign In form submission
  onSignInSubmit(): void {
    // ! Check if the form is valid
    if (!this.signInForm.valid) {
      console.log('Login form is invalid');
      return;
    }

    const { email, password } = this.signInForm.value;

    // ! best pratice to store email in lowercase to avoid case sensitivity issues
    const lowercaseEmail = email.toLowerCase().trim();

    //! Check for admin credentials
    this.loginService.checkAdmin(lowercaseEmail, password).subscribe({
      next: (admin) => {
        if (admin.length > 0) {
          // localStorage.setItem('currentUser', JSON.stringify(admin[0]));
          // localStorage.setItem('isAdmin', 'true');
          this.userStateService.setUserState(admin[0], true);
          alert('Admin login successful');
          this.router.navigate(['/admin']);
          this.signInForm.reset();
          this.hideSignInPassword = true;
        } else {
          this.loginService.validateUser(lowercaseEmail, password).subscribe({
            next: (user) => {
              if (user.length > 0) {
                // localStorage.setItem('currentUser', JSON.stringify(user[0]));
                // localStorage.setItem('isAdmin', 'false');

                this.userStateService.setUserState(user[0], false);
                this.router.navigate(['/home']);
                this.signInForm.reset();
                this.hideSignInPassword = true;
              } else {
                alert('Invalid email or password');
              }
            },
          });
        }
      },
    });
  }
}

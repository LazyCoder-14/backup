import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './admin-side.component.html',
  standalone: false,
  styleUrl: './admin-side.component.css',
})
export class AdminSideComponent {
  title = 'Evontiq';
  constructor(private route: Router, private fb: FormBuilder) {}
  bButton: boolean = true;

  goToNotificationPage() {
    this.route.navigate(['/notification']);
    this.bButton = !this.bButton;
  }
  goToUserAdminPage() {
    this.route.navigate(['/user-admin']);
    this.bButton = !this.bButton;
  }
  goToEventAdminPage() {
    this.route.navigate(['/event-admin']);
    this.bButton = !this.bButton;
  }
}

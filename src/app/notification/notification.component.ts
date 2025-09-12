import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: false,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  alerts: any[] = [];
  notifications: any[] = [];
  selectedNotification: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/alerts').subscribe(data => {
      this.alerts = data;
    });

    this.http.get<any[]>('http://localhost:3000/notifications').subscribe(data => {
      this.notifications = data;
    });
  }

  openModal(notification: any) {
    this.selectedNotification = notification;
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
  }


}

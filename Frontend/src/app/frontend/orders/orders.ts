import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe, SlicePipe],
  templateUrl: './orders.html',
})
export class OrdersComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.apiService.getUserOrders(user.id).subscribe({
        next: (res) => {
          this.orders.set(res.data || []);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }
}

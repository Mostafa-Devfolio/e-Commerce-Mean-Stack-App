import { Order } from './../../core/interfaces/user.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.html',
})
export class ManageOrdersComponent implements OnInit {
  private apiService = inject(ApiService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  // Status enum matching your backend
  availableStatuses = [
    'pending',
    'preparing',
    'shipped',
    'cancelledByUser',
    'cancelledByAdmin',
    'refused',
    'received',
  ];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.apiService.getAllOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.isLoading.set(false);
      },
    });
  }

  updateStatus(orderId: string | undefined, newStatus: string) {
    if (!orderId) return;

    this.apiService.changeOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Optimistically update the UI
        this.orders.update((orders) =>
          orders.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o)),
        );
      },
      error: (err) => console.error('Failed to update status', err),
    });
  }
}

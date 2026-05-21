import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './order-details.html',
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  order = signal<Order | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.apiService.getUserOrder(orderId).subscribe({
        next: (res) => {
          this.order.set(res.data || null);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }
}

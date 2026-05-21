import { ApiService } from './../../../core/services/api.service';
import { Product } from './../../../core/interfaces/user.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

ApiService

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.html',
})
export class ExploreComponent implements OnInit {
  private apiService = inject(ApiService);

  products = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.apiService.getProducts().subscribe({
      next: (res) => {
        // Filter out deleted or inactive products based on your schema
        const activeProducts = res.data.filter((p) => !p.isDeleted && p.isActive);
        this.products.set(activeProducts);
        console.log(this.products)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}

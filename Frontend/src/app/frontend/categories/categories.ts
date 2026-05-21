import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.html'
})
export class CategoriesComponent implements OnInit {
  private apiService = inject(ApiService);
  categories = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.apiService.getCategories().subscribe({
      next: (res) => {
        // Only show active categories to normal users
        this.categories.set(res.data?.filter((c: any) => c.isActive && !c.isDeleted) || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}

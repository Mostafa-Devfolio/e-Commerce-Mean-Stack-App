import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subcategories.html',
})
export class SubcategoriesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  subcategories = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.apiService.getSubcategories().subscribe({
        next: (res) => {
          // Filter subcategories that belong to the current category ID and are active
          this.subcategories.set(
            res.filter((s: any) => s.categoryId === categoryId && s.isActive && !s.isDeleted) || [],
          );
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }
}

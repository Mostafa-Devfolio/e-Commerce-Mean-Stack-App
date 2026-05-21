import { SignupComponent } from './frontend/auth/signup/signup';
import { Routes } from '@angular/router';

// Make sure you have created these guard files, or remove the canActivate arrays if you haven't yet!
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ProductDetailsComponent } from './frontend/products-details/products-details';
import { ExploreComponent } from './frontend/home/products/products';
import { HomeComponent } from './frontend/home/home';
import { CartComponent } from './frontend/cart/cart';
import { CheckoutComponent } from './frontend/checkout/checkout';
import { ManageOrdersComponent } from './dashboard/manage-orders/manage-orders';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users';
import { ManageTestimonialsComponent } from './dashboard/manage-testimonials/manage-testimonials';
import { ManageCategoriesComponent } from './dashboard/manage-categories/manage-categories';
import { ManageProductsComponent } from './dashboard/manage-products/manage-products';
import { Dashboard } from './dashboard/dashboard';
import { LoginComponent } from './frontend/auth/login/login';
import { Frontend } from './frontend/frontend';
import { DashboardComponent } from './dashboard/home/home';
import { OrdersComponent } from './frontend/orders/orders';
import { OrderDetailsComponent } from './frontend/order-details/order-details';
import { CategoriesComponent } from './frontend/categories/categories';
import { SubcategoriesComponent } from './frontend/subcategories/subcategories';
import { ManageSubcategories } from './dashboard/manage-subcategories/manage-subcategories';

export const routes: Routes = [
  // --- USER PUBLIC & AUTHENTICATED MODULE ---
  {
    path: '',
    component: Frontend,
    children: [
      // Public Pages
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'product/:id',
        component: ProductDetailsComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'category/:id',
        component: SubcategoriesComponent,
      },

      // Protected User Pages (Requires Login)
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [authGuard],
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent,
        canActivate: [authGuard],
      },
    ],
  },

  // --- AUTHENTICATION MODULE ---
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },

  // --- ADMIN DASHBOARD MODULE ---
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard, adminGuard], // Protects all admin routes
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'products',
        component: ManageProductsComponent,
      },
      {
        path: 'categories',
        component: ManageCategoriesComponent,
      },
      {
        path: 'subcategories',
        component: ManageSubcategories,
      },
      {
        path: 'orders',
        component: ManageOrdersComponent,
      },
      {
        path: 'users',
        component: ManageUsersComponent,
      },
      {
        path: 'testimonials',
        component: ManageTestimonialsComponent,
      },
    ],
  },

  // --- FALLBACK ROUTE ---
  { path: '**', redirectTo: '' },
];

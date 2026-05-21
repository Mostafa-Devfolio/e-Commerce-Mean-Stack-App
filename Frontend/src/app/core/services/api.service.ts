import { Product, Order, User } from './../interfaces/user.interface';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // --- Auth & Users ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, credentials);
  }

  // --- Product Methods ---
  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.apiUrl}/product`);
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, product);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http
      .get<{ data: Product[] }>(`${this.apiUrl}/product`)
      .pipe(map((res) => res.data.find((p) => p._id === id)));
  }

  // --- Cart Methods ---
  getUserCart(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/user`, { userId });
  }

  updateUser(id: string, userData: any): Observable<any> {
    // Assuming your backend has a PUT route for users
    return this.http.put(`${this.apiUrl}/user/${id}`, userData);
  }

  createUser(id: string, userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }

  addToCart(cartData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, cartData);
  }

  removeCartItem(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart`, { body: { userId, productId } });
  }

  updateCart(userId: string, productId: string, cartItems: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart`, { userId, productId, cartItems });
  }

  // --- Category & Subcategory Methods ---
  // (getCategories is already there from the admin section)

  getSubcategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subcategory`);
  }

  createSubcategory(subData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subcategory`, subData);
  }

  updateSubcategory(id: string, subData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/subcategory/${id}`, subData);
  }

  deleteSubcategory(id: string): Observable<any> {
    // Assuming your backend uses the ID in the URL for deletion or
    // you might need to adjust based on your specific backend route
    return this.http.delete(`${this.apiUrl}/subcategory/${id}`);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, userData);
  }

  // --- User Order Methods ---
  getUserOrders(userId: string): Observable<any> {
    // Using .request() because your backend expects a body on a GET request
    return this.http.request('GET', `${this.apiUrl}/order/userall`, { body: { userId } });
  }

  getUserOrder(orderId: string): Observable<any> {
    return this.http.request('GET', `${this.apiUrl}/order/user`, { body: { orderId } });
  }

  // --- Admin Product Methods ---
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${id}`, productData);
  }

  // --- Order Methods ---
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, orderData);
  }

  changeOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/order/status`, { orderId, status });
  }

  getAllOrders(): Observable<{ data: Order[] }> {
    return this.http.get<{ data: Order[] }>(`${this.apiUrl}/order/all`);
  }

  // --- Admin Category Methods ---
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/category/categoryAll`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/category`, categoryData);
  }

  updateCategory(categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/category`, categoryData);
  }

  // --- Admin User Methods ---
  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}/user`);
  }

  // --- Admin Testimonial Methods ---
  getTestimonials(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/testimonial/all`);
  }

  createTestimonial(testimonialData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/testimonial`, testimonialData);
  }

  updateTestimonial(id: string, testData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/testimonial/${id}`, testData);
  }

  deleteTestimonial(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/testimonial/${id}`);
  }

  updateTestimonialStatus(
    testimonialId: string,
    status: string,
    isApproved: boolean,
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/testimonial`, { testimonialId, status, isApproved });
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from "./shared/sidebar/sidebar";
import { HeaderComponent } from "./shared/header/header";

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, AdminSidebarComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}

import { Component } from '@angular/core';
import { HeaderComponent } from "./shared/header/header";
import { Footer } from "./shared/footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-frontend',
  imports: [RouterOutlet, HeaderComponent, Footer],
  templateUrl: './frontend.html',
  styleUrl: './frontend.css',
})
export class Frontend {}

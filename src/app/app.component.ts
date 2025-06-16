import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SpinnerService } from '../services/spinner.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, FooterComponent, NavbarComponent, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loading = false;
  constructor(private translate: TranslateService, private spinnerService: SpinnerService) {
    this.spinnerService.loading$.subscribe(state => {
      this.loading = state;
    });
  }
}

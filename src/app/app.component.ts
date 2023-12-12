import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxPansterComponent } from '../../projects/ngx-panster/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxPansterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}

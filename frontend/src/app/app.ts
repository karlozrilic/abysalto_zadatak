import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  message = signal('Click the button to load backend message');

  constructor(private backendService: BackendService) {}

  ngOnInit() {}

  loadMessage() {
    this.backendService.getHello().subscribe({
      next: (data) => this.message.set(data.message),
      error: (err) => this.message.set('Error: ' + err.message)
    });
  }
}

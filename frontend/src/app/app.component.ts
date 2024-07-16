import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule], // Include HttpClientModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private http: HttpClient) { } // Inject HttpClient

  sendRequest() {
    console.log("pressed");
    this.http.post('http://localhost:8080/test-button', {}).subscribe({
      next: (response) => console.log('Response:', response),
      error: (error) => console.error('Error:', error)
    });
  }
}

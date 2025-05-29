import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  likes = signal(0);

  likefunction() {
    this.likes.set(this.likes() + 1);
  }

  title = this.likes;

}

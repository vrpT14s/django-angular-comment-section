import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { signal } from '@angular/core';
import { Comment } from './models/comment'
import { CommentComponent } from './comment/comment.component'
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommentComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  comments: Comment[] = [
    //{ id : 1, text : "hello", image: "http://127.0.0.1:8000/media/images/25May28-17h42m55s.png", timestamp : new Date(), }, 
    //{ id : 2, text : "hello2", image: "http://127.0.0.1:8000/media/images/25May28-17h42m55s.png", timestamp : new Date(), }, 
  ];

  ngOnInit(): void {
    this.getComments().subscribe(value => this.comments = value);
  }
  getComments() {
    return this.http.get<Comment[]>('http://localhost:8000/api/comments/');
  }
}

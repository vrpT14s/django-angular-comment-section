import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';
import { Comment } from './models/comment'
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommentComponent } from './comment/comment.component'
import { CommentFormComponent } from './comment-form/comment-form.component'

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommentComponent, CommentFormComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  comments: Comment[] = [];

  getComments() {
    return this.http.get<Comment[]>('http://localhost:8000/api/comments/');
  }

  updateComments(): void {
    console.log(this.http);
    this.getComments().subscribe(value => this.comments = value);
    console.log(this.comments);
  }

  updateComment(form: FormData) {
    console.log(form);
    this.http.patch(`http://localhost:8000/api/comments/${form.get("id")}/`, form)
      .subscribe(value => this.updateComments());
    //^TODO: error handling
  }

  deleteComment(commentId: number) {
    console.log(this);
    this.http.delete(`http://localhost:8000/api/comments/${commentId}/`)
      .subscribe(value => this.updateComments());
    //^TODO: error handling
  }

  ngOnInit(): void {
    this.updateComments();
  }

  newComment(form: FormData) {
    console.log(form);
    this.http.post(`http://localhost:8000/api/comments/`, form)
      .subscribe(value => this.updateComments());
    //^TODO: error handling
  }
}

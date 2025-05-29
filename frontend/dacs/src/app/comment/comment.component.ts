import { Input, Component } from '@angular/core';
import { Comment } from '../models/comment';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [MatCardModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
	@Input() comment!: Comment;
}

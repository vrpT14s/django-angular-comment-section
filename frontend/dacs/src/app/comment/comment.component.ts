import {
  Input, Output, EventEmitter,
  Component, input,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { Comment } from '../models/comment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  imports: [
    MatCardModule, MatButtonModule, CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: Comment;

  @Output() onCommentDelete = new EventEmitter<number>();
  @Output() onCommentUpdate = new EventEmitter<FormData>();

  commentForm = new FormGroup({
    id: new FormControl(-1),
    text: new FormControl(''),
    image: new FormControl<File | null>(null),
    edited: new FormControl(true),
  });

  isEditing = false;
  previewImageUrl: string | undefined = undefined;
  removeImage = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["comment"]) {
        this.commentForm.patchValue({
          id: this.comment.id,
          text: this.comment.text,
        });
        this.previewImageUrl = this.comment.image;
    }
  }

  onDelete() {
    this.onCommentDelete.emit(this.comment.id);
  }

  onEdit() {
    this.startEdit();
  }

  startEdit() {
    this.isEditing = true;
  }

  onFileChange(event: any) {
    console.log(event);
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.commentForm.patchValue({ image: file });
    this.previewImageUrl = file ? URL.createObjectURL(file) : undefined;
  }

  onRemoveImage() {
    this.removeImage = true;
  }


  onUpdateSubmit() {
    const formData = new FormData();
    formData.append('id', this.comment.id.toString());
    if (this.commentForm.value.text != this.comment.text) {
      formData.append('text', this.commentForm.value.text || '');
    }
    const newImage = this.commentForm.value.image;
    if (this.removeImage) {
      formData.append('image', '');
    } else if (newImage) {
      formData.append('image', newImage);
    }
    formData.append('edited', "true");
    console.log(formData);

    this.onCommentUpdate.emit(formData);
    this.isEditing = false;
    this.removeImage = false;
  }
}

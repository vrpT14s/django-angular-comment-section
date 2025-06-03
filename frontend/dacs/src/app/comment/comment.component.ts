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

import { S3Service } from '../s3.service'

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
  @Input() imageUrlPrefix!: string;

  @Output() onCommentDelete = new EventEmitter<number>();
  @Output() onCommentUpdate = new EventEmitter<Record<string, any>>();

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
        if (this.comment.image) this.previewImageUrl = this.imageUrlPrefix + this.comment.image;
        console.log(this.previewImageUrl);
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
    //console.log(event);
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.commentForm.patchValue({ image: file });
    this.previewImageUrl = file ? URL.createObjectURL(file) : undefined;
  }

  onRemoveImage() {
    this.removeImage = true;
  }


  async onUpdateSubmit() {
    const form: Record<string, any> = {
      id: this.comment.id,
      edited: true
    }
    if (this.commentForm.value.text != this.comment.text) {
      form.text = this.commentForm.value.text || '';
    }
    if (this.removeImage) {
      form.image = null;
    } else if (this.commentForm.value.image) {
      let filename = await new S3Service().s3UploadImage(this.commentForm.value.image);
      if (!filename) return;
      form.image = filename;
    }

    this.onCommentUpdate.emit(form);
    this.isEditing = false;
    this.removeImage = false;
  }
}

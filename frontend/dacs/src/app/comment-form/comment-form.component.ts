import { Input, Output, EventEmitter, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})

export class CommentFormComponent {
  @Output() onFormSubmit = new EventEmitter<FormData>();


  commentForm = new FormGroup({
    text: new FormControl(''),
    image: new FormControl<File | null>(null),
  });

  previewImageUrl: string | undefined = undefined;

  onFileChange(event: any) {
    console.log(event);
    const file = (event?.target as HTMLInputElement)?.files?.[0];
    this.commentForm.patchValue({ image: file });
    this.previewImageUrl = file ? URL.createObjectURL(file) : undefined;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('text', this.commentForm.value.text || '');
    if (this.commentForm.value.image) {
      formData.append('image', this.commentForm.value.image);
    }
    this.onFormSubmit.emit(formData);
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      image: new FormControl<File | null>(null),
    });
    this.previewImageUrl = undefined;
  }
}

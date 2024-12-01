import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

// type FormAnswer = FormGroup<{ text: FormControl<string> }>;

// type FormQuestion = FormGroup<{
//   questionName: FormControl<string>;
//   answers: FormArray<FormAnswer>;
// }>;

// type Form = FormGroup<{
//   questions: FormArray<FormQuestion>;
// }>;
@Component({
  selector: 'app-formarray',
  templateUrl: './formarray.component.html',
  styleUrl: './formarray.component.css',
  imports: [ReactiveFormsModule, CommonModule],
})
export class QuizFormComponent {
  fb = inject(NonNullableFormBuilder);

  quizForm = this.fb.group({
    questions: this.fb.array([this.generateQuestion()]),
  });

  generateQuestion() {
    return this.fb.group({
      questionName: '',
      answers: this.fb.array([this.generateAnswer()]),
    });
  }

  addQuestion(): void {
    this.quizForm.controls.questions.push(this.generateQuestion());
  }

  generateAnswer() {
    return this.fb.group({
      text: '',
    });
  }

  removeQuestion(questionIndex: number): void {
    this.quizForm.controls.questions.removeAt(questionIndex);
  }

  addAnswer(questionIndex: number): void {
    this.quizForm.controls.questions
      .at(questionIndex)
      ?.controls?.answers?.push(this.generateAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    this.quizForm.controls.questions
      .at(questionIndex)
      ?.controls?.answers?.removeAt(answerIndex);
  }
  onSubmit() {
    console.log(this.quizForm.value);
  }
}

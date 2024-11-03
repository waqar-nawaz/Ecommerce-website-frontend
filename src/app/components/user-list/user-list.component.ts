import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  userForm!: FormGroup;
  isLoading: boolean = false;
  loader: boolean = false;
  userId: any;
  users: any[] = [];
  @ViewChild('myDialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.getUser();
    this.myForm();
  }

  myForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  getUser() {
    this.loader = true;
    this.authService.getuser().subscribe(
      (res: any) => {
        this.users = res;
        this.loader = false;
      },
      (err) => {
        this.loader = false;
      }
    );
  }

  openModel(user: any) {
    this.dialogRef.nativeElement.showModal();
    this.userForm.patchValue(user);
    this.userId = user?._id;
  }

  closeDialog() {
    this.dialogRef.nativeElement.close(); // To close the dialog
  }

  deleteUser(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(user?._id).subscribe(
          (res: any) => {
            this.isLoading = false;
            this.getUser();
          },
          (err) => {
            this.isLoading = false;
          }
        );
      }
    });
  }

  updaeUser() {
    this.isLoading = true;
    this.authService.updateUser(this.userForm.value, this.userId).subscribe(
      (res: any) => {
        this.closeDialog();
        this.userForm.reset();
        this.isLoading = false;
        this.getUser();
      },
      (err) => {
        this.isLoading = false;
        this.closeDialog();
      }
    );
  }
}

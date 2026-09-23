/* eslint-disable prettier/prettier */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'hgc-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  findQuery = '';
  findType: 'id' | 'email' = 'email';
  editingUserId: number | null = null;
  errorMessage = '';

  userForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    age: [null],
    emailAddress: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    ]
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.findQuery = '';
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.errorMessage = 'Failed to load users.';
        this.cdr.markForCheck();
      }
    });
  }

  onFind(): void {
    const query = this.findQuery.trim();
    if (!query) {
      this.loadUsers();
      return;
    }

    this.errorMessage = '';

    if (this.findType === 'id') {
      this.userService.getUserById(query).subscribe({
        next: (user) => (this.users = user ? [user] : []),
        error: () => {
          this.users = [];
          this.errorMessage = `User with ID "${query}" not found.`;
        }
      });
    } else {
      this.userService.getUserByEmail(query).subscribe({
        next: (user) => (this.users = user ? [user] : []),
        error: () => {
          this.users = [];
          this.errorMessage = `User with email "${query}" not found.`;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;
    const payload: Omit<User, 'userId'> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      age: formValue.age !== null ? Number(formValue.age) : 0,
      emailAddress: formValue.emailAddress
    };

    if (this.editingUserId !== null) {
      this.userService.updateUser(this.editingUserId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.errorMessage = 'Failed to update user. Verify schema match.';
        }
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Create failed:', err);
          this.errorMessage = 'Failed to create user.';
        }
      });
    }
  }

  onEdit(user: User): void {
    this.editingUserId = user.userId ?? null;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      emailAddress: user.emailAddress
    });
  }

  onDelete(id?: number): void {
    if (id === undefined) return;
    if (confirm('Are you sure you want to delete this garden?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.errorMessage = 'Failed to delete user.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  resetForm(): void {
    this.editingUserId = null;
    this.userForm.reset();
  }
}

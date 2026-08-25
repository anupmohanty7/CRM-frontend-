import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  User,
  UserStatus,
  CreateUserRequest,
  UpdateUserRequest
} from '../../shared/models/user';

import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm = '';
  roleFilter = 'ALL';
  statusFilter = 'ALL';

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  showDeleteModal = false;

  editingUser: User | null = null;
  selectedUser: User | null = null;

  activeModal: 'role' | 'status' | null = null;

  showPassword = false;

  formData: CreateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER'
  };

  updateData: UpdateUserRequest = {
    firstName: '',
    lastName: '',
    email: ''
  };

  selectedRole = 'USER';

  selectedStatus: UserStatus = UserStatus.ACTIVE;

  roles = [
    'ADMIN',
    'USER',
    'EMPLOYEE'
  ];

  statuses = [
    UserStatus.ACTIVE,
    UserStatus.INACTIVE,
    UserStatus.LOCKED,
    UserStatus.PENDING
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({

      next: (users) => {

        this.users = users;

        this.applyFilters();

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          this.getErrorMessage(
            error,
            'Failed to load users.'
          );
      }
    });
  }

  applyFilters(): void {

    const search =
      this.searchTerm.trim().toLowerCase();

    this.filteredUsers =
      this.users.filter(user => {

        const firstName =
          user.firstName?.toLowerCase() || '';

        const lastName =
          user.lastName?.toLowerCase() || '';

        const email =
          user.email?.toLowerCase() || '';

        const matchesSearch =
          !search ||
          firstName.includes(search) ||
          lastName.includes(search) ||
          email.includes(search);

        const matchesRole =
          this.roleFilter === 'ALL' ||
          user.role === this.roleFilter;

        const matchesStatus =
          this.statusFilter === 'ALL' ||
          user.status === this.statusFilter;

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus
        );
      });
  }

  openAddUser(): void {

    this.editingUser = null;

    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER'
    };

    this.showPassword = false;

    this.showForm = true;

    this.clearMessages();
  }

  openEditUser(user: User): void {

    this.editingUser = user;

    this.updateData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    this.showForm = true;

    this.clearMessages();
  }

  closeForm(): void {

    this.showForm = false;

    this.editingUser = null;

    this.showPassword = false;
  }

  createUser(): void {

    this.clearMessages();

    if (!this.formData.firstName.trim()) {

      this.errorMessage =
        'First name is required.';

      return;
    }

    if (!this.formData.email.trim()) {

      this.errorMessage =
        'Email is required.';

      return;
    }

    if (!this.isValidEmail(this.formData.email)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }

    if (!this.formData.password.trim()) {

      this.errorMessage =
        'Password is required.';

      return;
    }

    if (!this.isValidPassword(this.formData.password)) {

      this.errorMessage =
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.';

      return;
    }

    if (!this.formData.role) {

      this.errorMessage =
        'Please select a role.';

      return;
    }

    this.saving = true;

    this.userService
      .createUser(this.formData)
      .subscribe({

        next: (user) => {

          this.users.push(user);

          this.applyFilters();

          this.saving = false;

          this.showForm = false;

          this.showPassword = false;

          this.successMessage =
            'User created successfully.';
        },

        error: (error) => {

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Failed to create user.'
            );
        }
      });
  }

  updateUser(): void {

    if (!this.editingUser) {
      return;
    }

    this.clearMessages();

    if (!this.updateData.firstName.trim()) {

      this.errorMessage =
        'First name is required.';

      return;
    }

    if (!this.updateData.email.trim()) {

      this.errorMessage =
        'Email is required.';

      return;
    }

    if (!this.isValidEmail(this.updateData.email)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }

    this.saving = true;

    this.userService
      .updateUser(
        this.editingUser.id,
        this.updateData
      )
      .subscribe({

        next: (updatedUser) => {

          this.replaceUser(updatedUser);

          this.saving = false;

          this.showForm = false;

          this.editingUser = null;

          this.successMessage =
            'User updated successfully.';
        },

        error: (error) => {

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Failed to update user.'
            );
        }
      });
  }

  openRoleModal(user: User): void {

    this.selectedUser = user;

    this.selectedRole = user.role;

    this.activeModal = 'role';

    this.clearMessages();
  }

  changeRole(): void {

    if (!this.selectedUser) {
      return;
    }

    this.saving = true;

    this.clearMessages();

    this.userService
      .changeUserRole(
        this.selectedUser.id,
        this.selectedRole
      )
      .subscribe({

        next: (updatedUser) => {

          this.replaceUser(updatedUser);

          this.selectedUser = null;

          this.activeModal = null;

          this.saving = false;

          this.successMessage =
            'User role updated successfully.';
        },

        error: (error) => {

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Failed to change user role.'
            );
        }
      });
  }

  openStatusModal(user: User): void {

    this.selectedUser = user;

    this.selectedStatus = user.status;

    this.activeModal = 'status';

    this.clearMessages();
  }

  changeStatus(): void {

    if (!this.selectedUser) {
      return;
    }

    this.saving = true;

    this.clearMessages();

    this.userService
      .changeUserStatus(
        this.selectedUser.id,
        this.selectedStatus
      )
      .subscribe({

        next: (updatedUser) => {

          this.replaceUser(updatedUser);

          this.selectedUser = null;

          this.activeModal = null;

          this.saving = false;

          this.successMessage =
            'User status updated successfully.';
        },

        error: (error) => {

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Failed to change user status.'
            );
        }
      });
  }

  closeActionModal(): void {

    this.selectedUser = null;

    this.activeModal = null;
  }

  openDeleteModal(user: User): void {

    this.selectedUser = user;

    this.showDeleteModal = true;

    this.clearMessages();
  }

  closeDeleteModal(): void {

    this.showDeleteModal = false;

    this.selectedUser = null;
  }

  deleteUser(): void {

    if (!this.selectedUser) {
      return;
    }

    this.saving = true;

    this.clearMessages();

    const id = this.selectedUser.id;

    this.userService
      .deleteUser(id)
      .subscribe({

        next: () => {

          this.users =
            this.users.filter(
              user => user.id !== id
            );

          this.applyFilters();

          this.showDeleteModal = false;

          this.selectedUser = null;

          this.saving = false;

          this.successMessage =
            'User deleted successfully.';
        },

        error: (error) => {

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Failed to delete user.'
            );
        }
      });
  }

  replaceUser(updatedUser: User): void {

    const index =
      this.users.findIndex(
        user => user.id === updatedUser.id
      );

    if (index !== -1) {

      this.users[index] = updatedUser;
    }

    this.applyFilters();
  }

  isValidPassword(password: string): boolean {

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return passwordPattern.test(password);
  }

  isValidEmail(email: string): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }

  togglePasswordVisibility(): void {

    this.showPassword =
      !this.showPassword;
  }

  getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (error?.error?.message) {
      return error.error.message;
    }

    if (
      error?.error &&
      typeof error.error === 'string'
    ) {
      return error.error;
    }

    if (
      error?.error?.errors &&
      typeof error.error.errors === 'object'
    ) {

      const errors =
        Object.values(error.error.errors);

      if (errors.length > 0) {
        return String(errors[0]);
      }
    }

    if (error?.message) {
      return error.message;
    }

    return fallback;
  }

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';
  }

  getFullName(user: User): string {

    return `${user.firstName} ${user.lastName || ''}`.trim();
  }

  getInitials(user: User): string {

    const first =
      user.firstName
        ?.charAt(0)
        ?.toUpperCase() || '';

    const last =
      user.lastName
        ?.charAt(0)
        ?.toUpperCase() || '';

    return first + last;
  }
}
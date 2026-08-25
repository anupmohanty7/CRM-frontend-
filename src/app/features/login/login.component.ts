import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage =
        'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.authService
      .login(this.email, this.password)
      .subscribe({

        next: (token) => {

          console.log('Login successful');

          console.log('JWT received:', token);

          this.isLoading = false;

          this.router.navigate(['/dashboard']);
        },

        error: (error) => {

          console.error('Login failed:', error);

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password. Please try again.';
        }

      });
  }
}
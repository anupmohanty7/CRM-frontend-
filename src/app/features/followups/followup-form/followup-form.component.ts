import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FollowUpService } from '../../../core/services/followup.service';
import { CustomerService } from '../../../core/services/customer.service';

import { FollowUp } from '../../../shared/models/followup';
import { Customer } from '../../../shared/models/customer';

@Component({
  selector: 'app-followup-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './followup-form.component.html',
  styleUrl: './followup-form.component.css'
})
export class FollowupFormComponent implements OnInit {

  customers: Customer[] = [];

  isEditMode = false;
  followUpId: number | null = null;

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  form = {
    customerId: '',
    followUpDateTime: '',
    status: 'PENDING',
    notes: ''
  };

  constructor(
    private followUpService: FollowUpService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadCustomers();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.followUpId = Number(id);
      this.loadFollowUp(this.followUpId);
    }
  }

  loadCustomers(): void {

    this.customerService.getAllCustomers().subscribe({

      next: (data: Customer[]) => {
        this.customers = data;
      },

      error: (error) => {
        console.error('Error loading customers:', error);

        this.errorMessage =
          'Unable to load customers. Please try again.';
      }

    });
  }

  loadFollowUp(id: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.followUpService.getFollowUpById(id).subscribe({

      next: (followUp: FollowUp) => {

        this.form.customerId =
          followUp.customer?.id?.toString() ?? '';

        this.form.followUpDateTime =
          this.convertToDateTimeLocal(
            followUp.followUpDateTime
          );

        this.form.status =
          followUp.status;

        this.form.notes =
          followUp.notes ?? '';

        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'Error loading follow-up:',
          error
        );

        this.errorMessage =
          'Unable to load follow-up. Please try again.';

        this.isLoading = false;
      }

    });
  }

  convertToDateTimeLocal(date: string): string {

    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '';
    }

    const year = parsedDate.getFullYear();

    const month =
      String(parsedDate.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(parsedDate.getDate())
        .padStart(2, '0');

    const hours =
      String(parsedDate.getHours())
        .padStart(2, '0');

    const minutes =
      String(parsedDate.getMinutes())
        .padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.customerId) {
      this.errorMessage =
        'Please select a customer.';
      return;
    }

    if (!this.form.followUpDateTime) {
      this.errorMessage =
        'Please select a follow-up date and time.';
      return;
    }

    if (!this.form.status) {
      this.errorMessage =
        'Please select a status.';
      return;
    }

    this.isSaving = true;

    const requestBody = {

      customer: {
        id: Number(this.form.customerId)
      },

      followUpDateTime:
        this.form.followUpDateTime,

      status:
        this.form.status,

      notes:
        this.form.notes?.trim() || null
    };

    if (this.isEditMode && this.followUpId) {

      this.followUpService
        .updateFollowUp(
          this.followUpId,
          requestBody
        )
        .subscribe({

          next: () => {

            this.isSaving = false;

            this.router.navigate([
              '/followups'
            ]);
          },

          error: (error) => {

            console.error(
              'Error updating follow-up:',
              error
            );

            this.errorMessage =
              'Unable to update follow-up. Please try again.';

            this.isSaving = false;
          }

        });

    } else {

      this.followUpService
        .createFollowUp(requestBody)
        .subscribe({

          next: () => {

            this.isSaving = false;

            this.router.navigate([
              '/followups'
            ]);
          },

          error: (error) => {

            console.error(
              'Error creating follow-up:',
              error
            );

            this.errorMessage =
              'Unable to create follow-up. Please try again.';

            this.isSaving = false;
          }

        });
    }
  }

  cancel(): void {

    this.router.navigate([
      '/followups'
    ]);
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FollowUpService } from '../../core/services/followup.service';
import { FollowUp } from '../../shared/models/followup';

@Component({
  selector: 'app-followups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './followups.component.html',
  styleUrl: './followups.component.css'
})
export class FollowupsComponent implements OnInit {

  followUps: FollowUp[] = [];

  isLoading = false;
  isDeleting = false;

  errorMessage = '';

  searchTerm = '';
  selectedStatus = 'all';

  constructor(
    private followUpService: FollowUpService
  ) {}

  ngOnInit(): void {
    this.loadFollowUps();
  }

  loadFollowUps(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.followUpService.getAllFollowUps().subscribe({

      next: (data: FollowUp[]) => {

        this.followUps = data;
        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'Error loading follow-ups:',
          error
        );

        this.errorMessage =
          'Unable to load follow-ups. Please try again.';

        this.isLoading = false;
      }

    });
  }

  get filteredFollowUps(): FollowUp[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.followUps.filter(followUp => {

      const customerName =
        `${followUp.customer?.firstname ?? ''} ${followUp.customer?.lastname ?? ''}`
          .toLowerCase();

      const email =
        followUp.customer?.email
          ?.toLowerCase() ?? '';

      const notes =
        followUp.notes
          ?.toLowerCase() ?? '';

      const matchesSearch =
        !search ||
        customerName.includes(search) ||
        email.includes(search) ||
        notes.includes(search);

      const matchesStatus =
        this.selectedStatus === 'all' ||
        followUp.status === this.selectedStatus;

      return matchesSearch &&
             matchesStatus;
    });
  }

  get totalFollowUps(): number {
    return this.followUps.length;
  }

  get pendingFollowUps(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === 'PENDING'
    ).length;
  }

  get successfulFollowUps(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === 'SUCCESS_CLOSED'
    ).length;
  }

  get failedFollowUps(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === 'FAILED_CLOSED'
    ).length;
  }

  getCustomerName(followUp: FollowUp): string {

    return `${followUp.customer?.firstname ?? ''} ${followUp.customer?.lastname ?? ''}`
      .trim();
  }

  formatStatus(status: string): string {

    switch (status) {

      case 'PENDING':
        return 'Pending';

      case 'SUCCESS_CLOSED':
        return 'Successful';

      case 'FAILED_CLOSED':
        return 'Failed';

      default:
        return status;
    }
  }

  formatDateTime(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'PENDING':
        return 'pending';

      case 'SUCCESS_CLOSED':
        return 'success';

      case 'FAILED_CLOSED':
        return 'failed';

      default:
        return '';
    }
  }

  deleteFollowUp(followUp: FollowUp): void {

    if (!followUp.id) {
      return;
    }

    const customerName =
      this.getCustomerName(followUp);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the follow-up for ${customerName}?`
      );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.followUpService
      .deleteFollowUp(followUp.id)
      .subscribe({

        next: () => {

          this.isDeleting = false;

          this.followUps =
            this.followUps.filter(
              item => item.id !== followUp.id
            );
        },

        error: (error) => {

          console.error(
            'Error deleting follow-up:',
            error
          );

          this.errorMessage =
            'Unable to delete follow-up. Please try again.';

          this.isDeleting = false;
        }

      });
  }
}
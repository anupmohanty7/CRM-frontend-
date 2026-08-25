import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../shared/models/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  customers: Customer[] = [];

  isLoading = false;

  errorMessage = '';

  searchTerm = '';

  selectedType = 'all';

  selectedStatus = 'all';

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getAllCustomers().subscribe({

      next: (data: Customer[]) => {

        this.customers = data;
        this.isLoading = false;

      },

      error: (error) => {

        console.error(
          'Error loading customers:',
          error
        );

        this.errorMessage =
          'Unable to load customers. Please try again.';

        this.isLoading = false;

      }

    });

  }


  get filteredCustomers(): Customer[] {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    return this.customers.filter(customer => {

      const fullName =
        `${customer.firstname} ${customer.lastname}`
          .toLowerCase();

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.toLowerCase().includes(search) ||
        customer.company?.toLowerCase().includes(search);

      const matchesType =
        this.selectedType === 'all' ||
        customer.customerType?.toLowerCase() ===
        this.selectedType.toLowerCase();

      const matchesStatus =
        this.selectedStatus === 'all' ||
        customer.status?.toLowerCase() ===
        this.selectedStatus.toLowerCase();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );

    });

  }


  get totalCustomers(): number {

    return this.customers.filter(
      customer =>
        customer.customerType?.toLowerCase() === 'customer'
    ).length;

  }


  get totalLeads(): number {

    return this.customers.filter(
      customer =>
        customer.customerType?.toLowerCase() === 'lead'
    ).length;

  }


  get totalActive(): number {

    return this.customers.filter(
      customer =>
        customer.status?.toLowerCase() === 'active'
    ).length;

  }


  get convertedLeads(): number {

    return this.customers.filter(
      customer =>
        customer.leadStatus?.toLowerCase() === 'converted'
    ).length;

  }


  getCustomerName(customer: Customer): string {

    return `${customer.firstname} ${customer.lastname}`;

  }


  getCustomerTypeLabel(customer: Customer): string {

    if (
      customer.customerType?.toLowerCase() === 'lead'
    ) {

      return 'Lead';

    }

    return 'Customer';

  }


  formatDate(
    date: string | null | undefined
  ): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

}
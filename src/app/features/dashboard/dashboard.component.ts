import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Chart,
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../shared/models/dashboard.model';

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {

  dashboard: Dashboard | null = null;

  loading = true;
  errorMessage = '';

  private leadChart?: Chart;
  private followUpChart?: Chart;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    if (this.dashboard) {
      this.createCharts();
    }
  }

  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({

      next: (data) => {

        this.dashboard = data;
        this.loading = false;

        setTimeout(() => {
          this.createCharts();
        });

      },

      error: (error) => {

        console.error('Dashboard loading failed:', error);

        this.loading = false;

        this.errorMessage =
          'Unable to load dashboard data. Please try again.';

      }

    });
  }

  createCharts(): void {

    if (!this.dashboard) {
      return;
    }

    this.destroyCharts();

    const leadCanvas =
      document.getElementById(
        'leadChart'
      ) as HTMLCanvasElement | null;

    const followUpCanvas =
      document.getElementById(
        'followUpChart'
      ) as HTMLCanvasElement | null;

    if (!leadCanvas || !followUpCanvas) {
      return;
    }

    /*
     * Lead Status Chart
     */

    this.leadChart = new Chart(
      leadCanvas,
      {
        type: 'bar',

        data: {
          labels: [
            'New',
            'Qualified',
            'Converted',
            'Lost'
          ],

          datasets: [
            {
              label: 'Leads',

              data: [
                this.dashboard.newLeads,
                this.dashboard.qualifiedLeads,
                this.dashboard.convertedLeads,
                this.dashboard.lostLeads
              ],

              borderWidth: 1,

              borderRadius: 6
            }
          ]
        },

        options: {
          responsive: true,

          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false
            }
          },

          scales: {
            y: {
              beginAtZero: true,

              ticks: {
                precision: 0
              }
            }
          }
        }
      }
    );


    /*
     * Follow-up Chart
     */

    this.followUpChart = new Chart(
      followUpCanvas,
      {
        type: 'doughnut',

        data: {
          labels: [
            'Pending',
            'Successful',
            'Failed'
          ],

          datasets: [
            {
              data: [
                this.dashboard.pendingFollowUps,
                this.dashboard.successfulFollowUps,
                this.dashboard.failedFollowUps
              ],

              borderWidth: 0
            }
          ]
        },

        options: {
          responsive: true,

          maintainAspectRatio: false,

          cutout: '68%',

          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    );
  }

  destroyCharts(): void {

    if (this.leadChart) {
      this.leadChart.destroy();
      this.leadChart = undefined;
    }

    if (this.followUpChart) {
      this.followUpChart.destroy();
      this.followUpChart = undefined;
    }
  }

  refreshDashboard(): void {
    this.destroyCharts();
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}
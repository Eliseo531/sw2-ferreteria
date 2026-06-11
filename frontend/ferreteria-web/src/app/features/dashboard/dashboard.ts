import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  loading = true;
  errorMessage = '';

  summary: any = null;

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.loading = true;

    this.dashboardService.getSummary().subscribe({
      next: (result) => {
        this.summary = result.data.dashboardSummary;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR DASHBOARD:', error);
        this.errorMessage = 'No se pudo cargar el dashboard';
        this.loading = false;
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}

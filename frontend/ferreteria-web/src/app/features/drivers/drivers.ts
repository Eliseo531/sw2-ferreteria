import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../core/services/driver.service';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drivers.html',
  styleUrl: './drivers.css',
})
export class Drivers implements OnInit {
  private driverService = inject(DriverService);

  drivers: any[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe({
      next: (result) => {
        const users = result.data.users || [];

        this.drivers = users.filter((user: any) =>
          user.roles?.some((role: any) => role.nombre === 'REPARTIDOR'),
        );

        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR DRIVERS:', error);
        this.errorMessage = 'No se pudieron cargar los repartidores';
        this.loading = false;
      },
    });
  }
}

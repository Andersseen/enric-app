import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportsStorageService } from '@service/reports-storage.service';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  filterOutline,
  openOutline,
  searchOutline,
  shareOutline,
  trashOutline,
} from 'ionicons/icons';
import { Report, ReportType } from '../../../models/report.model';

@Component({
  selector: 'app-reports-list',
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton,
    IonBadge,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Mis Reportes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Stats Dashboard -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats().total }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Actuaciones</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats().actuacion }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Trampas</p>
          <p class="text-2xl font-bold text-green-600">{{ stats().trampa }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Prevención</p>
          <p class="text-2xl font-bold text-orange-600">{{ stats().prevencion }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <ion-searchbar
          [(ngModel)]="searchTerm"
          (ionInput)="onSearchChange()"
          placeholder="Buscar reportes..."
          class="flex-1"
        ></ion-searchbar>

        <ion-select
          [(ngModel)]="selectedType"
          (ionChange)="onFilterChange()"
          placeholder="Filtrar por tipo"
          interface="popover"
          class="w-full sm:w-48"
        >
          <ion-select-option [value]="null">Todos</ion-select-option>
          <ion-select-option value="actuacion">Actuaciones</ion-select-option>
          <ion-select-option value="trampa">Trampas</ion-select-option>
          <ion-select-option value="prevencion">Prevención</ion-select-option>
        </ion-select>
      </div>

      <!-- Reports List -->
      @if (filteredReports().length > 0) {
        <ion-list class="rounded-lg overflow-hidden">
          @for (report of filteredReports(); track report.id) {
            <ion-item
              lines="full"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ion-icon
                slot="start"
                name="document-text-outline"
                [color]="getReportColor(report.type)"
                class="text-2xl"
              ></ion-icon>

              <ion-label>
                <h2 class="font-semibold text-gray-900 dark:text-white">
                  {{ report.filename }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ report.createdAt | date: 'dd/MM/yyyy HH:mm' }} ·
                  {{ formatFileSize(report.fileSize) }}
                </p>

                <!-- Session Info -->
                @if (report.metadata?.worker || report.metadata?.date || report.metadata?.weather) {
                  <div class="flex flex-wrap gap-2 mt-1">
                    @if (report.metadata?.worker) {
                      <span
                        class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                      >
                        👤 {{ report.metadata?.worker }}
                      </span>
                    }
                    @if (report.metadata?.date) {
                      <span
                        class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                      >
                        📅 {{ report.metadata?.date }}
                        @if (report.metadata?.time) {
                          {{ report.metadata?.time }}
                        }
                      </span>
                    }
                    @if (report.metadata?.weather) {
                      <span
                        class="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded"
                      >
                        🌤️ {{ report.metadata?.weather }}
                      </span>
                    }
                  </div>
                }

                <!-- Report Metadata -->
                <div class="flex flex-wrap gap-2 mt-1">
                  <ion-badge [color]="getReportColor(report.type)" class="text-xs">
                    {{ getReportTypeLabel(report.type) }}
                  </ion-badge>
                  @if (report.metadata?.zone) {
                    <span class="text-xs text-gray-600 dark:text-gray-300">
                      📍 {{ report.metadata?.zone }}
                    </span>
                  }
                  @if (report.metadata?.species) {
                    <span class="text-xs text-gray-600 dark:text-gray-300">
                      🦅 {{ report.metadata?.species }}
                    </span>
                  }
                </div>
              </ion-label>

              <!-- Action Buttons -->
              <div slot="end" class="flex gap-1">
                <ion-button fill="clear" size="small" (click)="openReport(report)">
                  <ion-icon slot="icon-only" name="open-outline" color="success"></ion-icon>
                </ion-button>
                <ion-button fill="clear" size="small" (click)="shareReport(report)">
                  <ion-icon slot="icon-only" name="share-outline" color="primary"></ion-icon>
                </ion-button>
                <ion-button fill="clear" size="small" (click)="confirmDelete(report)">
                  <ion-icon slot="icon-only" name="trash-outline" color="danger"></ion-icon>
                </ion-button>
              </div>
            </ion-item>
          }
        </ion-list>
      } @else {
        <!-- Empty State -->
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <ion-icon
            name="document-text-outline"
            class="text-6xl text-gray-300 dark:text-gray-600 mb-4"
          ></ion-icon>
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No hay reportes
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-xs">
            Los reportes que generes aparecerán aquí. Crea tu primer reporte desde Actuación,
            Trampas o Prevención.
          </p>
        </div>
      }
    </ion-content>
  `,
  styles: `
    ion-searchbar {
      --background: white;
      --border-radius: 0.5rem;
      --box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    ion-select {
      --background: white;
      --border-radius: 0.5rem;
    }

    ion-list {
      background: transparent;
    }

    ion-item {
      --background: white;
      --border-color: #e5e7eb;
    }

    @media (prefers-color-scheme: dark) {
      ion-searchbar {
        --background: #1f2937;
      }

      ion-select {
        --background: #1f2937;
      }

      ion-item {
        --background: #1f2937;
        --border-color: #374151;
      }
    }
  `,
})
export class ReportsListPage implements OnInit {
  private reportsStorage = inject(ReportsStorageService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  // State
  reports = signal<Report[]>([]);
  searchTerm = '';
  selectedType: ReportType | null = null;

  // Computed
  stats = computed(() => {
    const allReports = this.reports();
    return {
      total: allReports.length,
      actuacion: allReports.filter((r) => r.type === 'actuacion').length,
      trampa: allReports.filter((r) => r.type === 'trampa').length,
      prevencion: allReports.filter((r) => r.type === 'prevencion').length,
    };
  });

  filteredReports = computed(() => {
    let filtered = this.reports();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.filename.toLowerCase().includes(term) ||
          r.metadata?.zone?.toLowerCase().includes(term) ||
          r.metadata?.species?.toLowerCase().includes(term),
      );
    }

    if (this.selectedType) {
      filtered = filtered.filter((r) => r.type === this.selectedType);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  constructor() {
    addIcons({
      shareOutline,
      trashOutline,
      documentTextOutline,
      filterOutline,
      searchOutline,
      openOutline,
    });
  }

  async ngOnInit() {
    await this.loadReports();
  }

  async loadReports() {
    try {
      const reports = await this.reportsStorage.getReports();
      this.reports.set(reports);
    } catch (error) {
      console.error('Error loading reports:', error);
      const toast = await this.toastController.create({
        message: 'Error al cargar los reportes',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  onSearchChange() {
    this.filteredReports();
  }

  onFilterChange() {
    this.filteredReports();
  }

  async openReport(report: Report) {
    try {
      await this.reportsStorage.openReport(report.id);
    } catch (error) {
      console.error('Error opening report:', error);
      const toast = await this.toastController.create({
        message: 'Error al abrir el reporte',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  async shareReport(report: Report) {
    try {
      await this.reportsStorage.shareReport(report.id);
    } catch (error) {
      console.error('Error sharing report:', error);
      const toast = await this.toastController.create({
        message: 'Error al compartir el reporte',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  async confirmDelete(report: Report) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${report.filename}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteReport(report),
        },
      ],
    });

    await alert.present();
  }

  async deleteReport(report: Report) {
    try {
      await this.reportsStorage.deleteReport(report.id);
      await this.loadReports();

      const toast = await this.toastController.create({
        message: 'Reporte eliminado',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error deleting report:', error);
      const toast = await this.toastController.create({
        message: 'Error al eliminar el reporte',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  getReportColor(type: ReportType): string {
    const colors: Record<ReportType, string> = {
      actuacion: 'primary',
      trampa: 'success',
      prevencion: 'warning',
    };
    return colors[type];
  }

  getReportTypeLabel(type: ReportType): string {
    const labels: Record<ReportType, string> = {
      actuacion: 'Actuación',
      trampa: 'Trampa',
      prevencion: 'Prevención',
    };
    return labels[type];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

export default ReportsListPage;

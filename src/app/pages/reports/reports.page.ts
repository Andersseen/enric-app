import { Component, ElementRef, inject, ViewChild, OnInit, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { ExcelService } from '@service/excel.service';
import { ReportStore } from '@service/report-store';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cloudUploadOutline,
  downloadOutline,
  flashOutline,
  refreshOutline,
  trashBinOutline,
} from 'ionicons/icons';
import ActuacionTableComponent from '../../components/actuacion-table/actuacion-table.component';

@Component({
  selector: 'app-reports',

  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    ActuacionTableComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goHome()" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="cursor-pointer" (click)="goHome()">Reportes</ion-title>
        <ion-buttons slot="end">
          <!-- Hidden file input -->
          <input
            #fileInput
            type="file"
            accept=".xlsx"
            (change)="onFileSelected($event)"
            style="display: none"
          />
          <ion-button (click)="fileInput.click()" title="Importar Excel">
            <ion-icon slot="icon-only" name="cloud-upload-outline"></ion-icon>
          </ion-button>
          <!-- <ion-button (click)="generateMock()" title="Generar Datos">
            <ion-icon slot="icon-only" name="flash-outline"></ion-icon>
          </ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col gap-4 h-full">
        <!-- Control Bar -->
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
        >
          <div class="text-sm text-gray-600">
            Total registros: <span class="font-bold">{{ count() }}</span>
          </div>
          <div class="w-full sm:w-auto">
            <ion-button
              color="success"
              class="w-full sm:w-auto"
              (click)="exportExcel()"
              [disabled]="count() === 0"
            >
              <ion-icon slot="start" name="download-outline"></ion-icon>
              Exportar Excel
            </ion-button>
          </div>
        </div>

        <!-- Table -->
        <app-actuacion-table [data]="rows()" (remove)="removeRow($event)" />

        <!-- Backup / Clear Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
          <ion-button
            color="warning"
            fill="outline"
            class="w-full"
            (click)="restoreBackup()"
            [disabled]="!hasBackups()"
          >
            <ion-icon slot="start" name="refresh-outline"></ion-icon>
            Recuperar último backup
          </ion-button>

          <ion-button
            color="danger"
            fill="outline"
            class="w-full"
            (click)="clearTable()"
            [disabled]="count() === 0"
          >
            <ion-icon slot="start" name="trash-bin-outline"></ion-icon>
            Limpiar
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
})
export default class ReportsPage {
  private router = inject(Router);
  private reportStore = inject(ReportStore);
  private excelService = inject(ExcelService);
  private toastController = inject(ToastController);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Signals from store
  rows = this.reportStore.rows;
  count = this.reportStore.count;
  hasBackups = this.reportStore.hasBackups;

  constructor() {
    addIcons({
      downloadOutline,
      cloudUploadOutline,
      trashBinOutline,
      flashOutline,
      arrowBack,
      refreshOutline,
    });
  }

  async onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      try {
        const importedData = await this.excelService.importActuacionExcel(file);
        this.reportStore.addRows(importedData);
        this.showToast(`Importadas ${importedData.length} filas correctamente`, 'success');
      } catch (error) {
        console.error('Import error:', error);
        this.showToast('Error al importar el archivo. Verifica el formato.', 'danger');
      } finally {
        target.value = ''; // Reset input
      }
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async exportExcel() {
    try {
      await this.excelService.exportGlobalExcel(this.rows());
      this.showToast('Excel exportado correctamente', 'success');
    } catch (error) {
      console.error('Export error:', error);
      this.showToast('Error al exportar el archivo', 'danger');
    }
  }

  async clearTable() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos de la tabla?')) {
      await this.reportStore.clear();
      this.showToast('Tabla limpia. Backup guardado para recuperación.', 'medium');
    }
  }

  async restoreBackup() {
    const restored = await this.reportStore.restoreLatestBackup();
    if (restored > 0) {
      this.showToast(`Backup recuperado (${restored} registros)`, 'success');
      return;
    }

    this.showToast('No hay backups para recuperar', 'medium');
  }

  removeRow(index: number) {
    if (confirm('¿Borrar esta fila?')) {
      this.reportStore.removeRow(index);
    }
  }

  async generateMock() {
    this.reportStore.generateMockData();
    this.showToast('Datos de prueba generados', 'medium');
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'medium') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}

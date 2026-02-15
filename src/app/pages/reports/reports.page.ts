import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
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
  trashBinOutline,
} from 'ionicons/icons';
import ActuacionTableComponent from '../../components/actuacion-table/actuacion-table.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reports',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    ActuacionTableComponent,
    RouterLink,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/home" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Reportes</ion-title>
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
        <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-600">
            Total registros: <span class="font-bold">{{ count() }}</span>
          </div>
          <div class="flex gap-2">
            <ion-button
              color="danger"
              fill="outline"
              size="small"
              (click)="clearTable()"
              [disabled]="count() === 0"
            >
              <ion-icon slot="start" name="trash-bin-outline"></ion-icon>
              Limpiar
            </ion-button>
            <ion-button
              color="success"
              size="small"
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
      </div>
    </ion-content>
  `,
})
export default class ReportsPage {
  private reportStore = inject(ReportStore);
  private excelService = inject(ExcelService);
  private toastController = inject(ToastController);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Signals from store
  rows = this.reportStore.rows;
  count = this.reportStore.count;

  constructor() {
    addIcons({ downloadOutline, cloudUploadOutline, trashBinOutline, flashOutline, arrowBack });
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
      this.reportStore.clear();
      this.showToast('Tabla limpia', 'medium');
    }
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

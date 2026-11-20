import { Component, ElementRef, inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
  AlertController,
} from '@ionic/angular';
import { ExcelService } from '@service/excel.service';
import { ReportStore } from '@service/report-store';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cloudUploadOutline,
  downloadOutline,
  refreshOutline,
  trashBinOutline,
} from 'ionicons/icons';
import ActuacionTableComponent from '../../components/actuacion-table/actuacion-table.component';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goHome()" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="cursor-pointer" (click)="goHome()">{{ t('reports.title') }}</ion-title>
        <ion-buttons slot="end">
          <!-- Hidden file input -->
          <input
            #fileInput
            type="file"
            accept=".xlsx"
            (change)="onFileSelected($event)"
            style="display: none"
          />
          <ion-button (click)="fileInput.click()" [title]="t('reports.import')">
            <ion-icon slot="icon-only" name="cloud-upload-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col gap-4 h-full">
        <!-- Control Bar -->
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-surface p-4 rounded-lg shadow-sm border border-border"
        >
          <div class="text-sm text-muted">
            {{ t('reports.total', { count: count() }) }}
          </div>
          <div class="w-full sm:w-auto">
            <ion-button
              color="success"
              class="w-full sm:w-auto"
              (click)="exportExcel()"
              [disabled]="count() === 0"
            >
              <ion-icon slot="start" name="download-outline"></ion-icon>
              {{ t('reports.export') }}
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
            {{ t('reports.restore') }}
          </ion-button>

          <ion-button
            color="danger"
            fill="outline"
            class="w-full"
            (click)="clearTable()"
            [disabled]="count() === 0"
          >
            <ion-icon slot="start" name="trash-bin-outline"></ion-icon>
            {{ t('reports.clear') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
})
export default class ReportsPage {
  protected t = injectT(i18n);
  private router = inject(Router);
  private reportStore = inject(ReportStore);
  private excelService = inject(ExcelService);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

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
        this.showToast(this.t('reports.imported', { count: importedData.length }), 'success');
      } catch (error) {
        console.error('Import error:', error);
        this.showToast(this.t('reports.importError'), 'danger');
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
      this.showToast(this.t('reports.exported'), 'success');
    } catch (error) {
      console.error('Export error:', error);
      this.showToast(this.t('reports.exportError'), 'danger');
    }
  }

  async clearTable() {
    if (await this.confirm(this.t('reports.confirmClear'), this.t('common.clear'))) {
      await this.reportStore.clear();
      this.showToast(this.t('reports.cleared'), 'medium');
    }
  }

  async restoreBackup() {
    const restored = await this.reportStore.restoreLatestBackup();
    if (restored > 0) {
      this.showToast(this.t('reports.restored', { count: restored }), 'success');
      return;
    }

    this.showToast(this.t('reports.noBackups'), 'medium');
  }

  async removeRow(index: number) {
    if (await this.confirm(this.t('reports.confirmDeleteRow'), this.t('common.delete'))) {
      this.reportStore.removeRow(index);
    }
  }

  /** Diálogo de confirmación de Ionic (en lugar del confirm() del navegador). */
  private async confirm(message: string, confirmText: string): Promise<boolean> {
    const alert = await this.alertController.create({
      message,
      buttons: [
        { text: this.t('common.cancel'), role: 'cancel' },
        { text: confirmText, role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
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

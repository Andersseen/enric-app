import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { GlobalExcelService, ScfSectionData, ScfSheetData } from '@service/global-excel.service';
import { ReportStore } from '@service/report-store';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cloudUploadOutline,
  downloadOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-full-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
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
        <ion-title>Reporte entero</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg-background text-foreground">
      <div class="flex flex-col gap-4 text-foreground">
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-surface p-4 rounded-lg shadow-sm border border-border"
        >
          <div class="text-sm text-muted min-h-6 flex items-center">
            Filas en ACTUACIONES_DIARIAS:
            <span class="font-bold">{{ actuacionesTableCount() }}</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              #fileInput
              type="file"
              accept=".xlsx"
              (change)="onFileSelected($event)"
              style="display: none"
            />

            @if (activeSheet().id === 'ACTUACIONES_DIARIAS') {
              <ion-button
                color="secondary"
                fill="outline"
                (click)="moveActuacionesData()"
                [disabled]="sourceReportCount() === 0"
              >
                <ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>
                Mover data
              </ion-button>
            }

            <ion-button fill="outline" color="primary" (click)="fileInput.click()">
              <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
              Importar SCF
            </ion-button>

            <ion-button color="primary" (click)="exportScf()">
              <ion-icon slot="start" name="download-outline"></ion-icon>
              Exportar SCF
            </ion-button>
          </div>
        </div>

        <div class="bg-surface border border-border rounded-xl p-2">
          <div
            role="radiogroup"
            aria-label="Hojas SCF"
            class="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            @for (sheet of scfSheets(); track sheet.id) {
              <button
                type="button"
                role="radio"
                [attr.aria-checked]="selectedSheetId() === sheet.id"
                class="w-full text-left rounded-lg border px-3 py-2.5 transition-colors"
                [class.border-primary]="selectedSheetId() === sheet.id"
                [class.bg-background]="selectedSheetId() === sheet.id"
                [class.border-border]="selectedSheetId() !== sheet.id"
                [class.bg-surface]="selectedSheetId() !== sheet.id"
                (click)="selectSheet(sheet.id)"
              >
                <div class="flex items-start gap-2">
                  <span
                    class="mt-0.5 h-4 w-4 rounded-full border-2 shrink-0"
                    [class.border-primary]="selectedSheetId() === sheet.id"
                    [class.bg-primary]="selectedSheetId() === sheet.id"
                    [class.border-muted]="selectedSheetId() !== sheet.id"
                  ></span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-foreground leading-5">
                      {{ sheetLabel(sheet.id) }}
                    </p>
                    <p class="text-xs text-muted leading-4 truncate">{{ sheet.title }}</p>
                  </div>
                </div>
              </button>
            }
          </div>
        </div>

        <div class="bg-surface p-4 rounded-lg shadow-sm border border-border flex flex-col gap-3">
          <h3 class="text-lg font-semibold text-foreground">{{ sheetLabel(activeSheet().id) }}</h3>

          <div class="grid grid-cols-1 gap-3">
            @for (section of activeSheet().sections; track section.title) {
              <div class="rounded-lg border border-border bg-background overflow-hidden">
                <div
                  class="px-3 py-2 bg-surface border-b border-border flex items-center justify-between gap-2"
                >
                  <p class="font-semibold text-sm text-foreground">{{ section.title }}</p>
                  <span class="text-xs text-muted">{{ section.headers.length }} columnas</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="bg-surface">
                        @for (header of section.headers; track header) {
                          <th
                            class="border-b border-r border-border px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                          >
                            {{ header }}
                          </th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of visibleRows(section); track $index) {
                        <tr>
                          @for (cell of row; track $index) {
                            <td
                              class="border-b border-r border-border px-3 py-2 bg-background text-foreground whitespace-nowrap"
                            >
                              {{ cell || ' ' }}
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </ion-content>
  `,
})
export default class FullReportPage {
  private globalExcelService = inject(GlobalExcelService);
  private reportStore = inject(ReportStore);
  private toastController = inject(ToastController);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  sourceReportRows = this.reportStore.rows;
  sourceReportCount = this.reportStore.count;
  scfSheets = signal<ScfSheetData[]>(this.globalExcelService.createScfSheetsData());
  selectedSheetId = signal<string>(this.scfSheets()[0]?.id ?? 'DATOS_GENERALES');

  activeSheet = computed(() => {
    return (
      this.scfSheets().find((sheet) => sheet.id === this.selectedSheetId()) ?? this.scfSheets()[0]
    );
  });

  actuacionesTableCount = computed(() => {
    const actuacionesSheet = this.scfSheets().find((sheet) => sheet.id === 'ACTUACIONES_DIARIAS');
    const actuacionesSection = actuacionesSheet?.sections.find(
      (section) => section.title === 'ACTUACIONES_DIARIAS',
    );
    return actuacionesSection?.rows.length ?? 0;
  });

  constructor() {
    addIcons({
      arrowBack,
      cloudUploadOutline,
      downloadOutline,
      swapHorizontalOutline,
    });
  }

  async exportScf() {
    try {
      await this.globalExcelService.exportScfWorkbook(this.scfSheets());
      this.showToast('SCF exportado correctamente', 'success');
    } catch (error) {
      console.error('SCF export error:', error);
      this.showToast('Error al exportar SCF', 'danger');
    }
  }

  async onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const importedSheets = await this.globalExcelService.importScfWorkbook(file);
      this.scfSheets.set(importedSheets);
      this.selectedSheetId.set(importedSheets[0]?.id ?? 'DATOS_GENERALES');
      this.showToast('SCF importado correctamente', 'success');
    } catch (error) {
      console.error('SCF import error:', error);
      this.showToast('Error al importar el SCF', 'danger');
    } finally {
      target.value = '';
    }
  }

  selectSheet(sheetId: string) {
    this.selectedSheetId.set(sheetId);
  }

  moveActuacionesData() {
    const rows = this.globalExcelService.mapGlobalRowsToActuacionesRows(this.sourceReportRows());
    this.updateSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS', rows);
  }

  sheetLabel(sheetId: string): string {
    return sheetId.replace(/_/g, ' ');
  }

  visibleRows(section: ScfSectionData): string[][] {
    if (section.rows.length > 0) {
      return section.rows;
    }

    return Array.from({ length: section.emptyRows || 6 }, () =>
      Array(section.headers.length).fill(''),
    );
  }

  private updateSectionRows(sheetId: string, sectionTitle: string, rows: string[][]) {
    this.scfSheets.update((current) =>
      current.map((sheet) => {
        if (sheet.id !== sheetId) {
          return sheet;
        }

        return {
          ...sheet,
          sections: sheet.sections.map((section) => {
            if (section.title !== sectionTitle) {
              return section;
            }

            return {
              ...section,
              rows,
            };
          }),
        };
      }),
    );
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}

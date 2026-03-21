import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { GlobalExcelService, ScfSectionData, ScfSheetData } from '@service/global-excel.service';
import { ReportStore } from '@service/report-store';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cloudUploadOutline,
  downloadOutline,
  swapHorizontalOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-full-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goHome()" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="cursor-pointer" (click)="goHome()">Reporte SCF</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg-background text-foreground">
      <div class="flex flex-col gap-4 text-foreground">
        <!-- ── Barra de acciones ── -->
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3
                    bg-surface p-4 rounded-lg shadow-sm border border-border"
        >
          <!-- Contador de filas -->
          <div class="text-sm text-muted min-h-6 flex items-center gap-1">
            Filas en ACTUACIONES DIARIAS:
            <span class="font-bold text-foreground">{{ actuacionesTableCount() }}</span>
            @if (actuacionesTableCount() > 0) {
              <ion-icon name="checkmark-circle-outline" class="text-green-500 text-base"></ion-icon>
            }
          </div>

          <!-- Botones -->
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
                Mover data ({{ sourceReportCount() }})
              </ion-button>
            }

            <ion-button
              fill="outline"
              color="primary"
              (click)="fileInput.click()"
              [disabled]="isLoading()"
            >
              <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
              Importar SCF
            </ion-button>

            <ion-button color="primary" (click)="exportScf()" [disabled]="isLoading()">
              <ion-icon slot="start" name="download-outline"></ion-icon>
              Exportar SCF
            </ion-button>
          </div>
        </div>

        <!-- ── Loading overlay ── -->
        @if (isLoading()) {
          <div class="flex items-center justify-center gap-2 text-sm text-muted py-2">
            <span
              class="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            ></span>
            {{ loadingMessage() }}
          </div>
        }

        <!-- ── Selector de hojas ── -->
        <div class="bg-surface border border-border rounded-xl p-2">
          <div
            role="radiogroup"
            aria-label="Hojas SCF"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
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
                    class="mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-colors"
                    [class.border-primary]="selectedSheetId() === sheet.id"
                    [class.bg-primary]="selectedSheetId() === sheet.id"
                    [class.border-muted]="selectedSheetId() !== sheet.id"
                  ></span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-foreground leading-5">
                      {{ sheetLabel(sheet.id) }}
                    </p>
                    <p class="text-xs text-muted leading-4 truncate">{{ sheet.title }}</p>
                    <p class="text-xs text-muted leading-4">
                      {{ sheetRowCount(sheet) }} fila{{ sheetRowCount(sheet) !== 1 ? 's' : '' }}
                    </p>
                  </div>
                </div>
              </button>
            }
          </div>
        </div>

        <!-- ── Contenido de la hoja activa ── -->
        <div class="bg-surface p-4 rounded-lg shadow-sm border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">
              {{ sheetLabel(activeSheet().id) }}
            </h3>
            <span class="text-xs text-muted bg-background px-2 py-1 rounded border border-border">
              {{ activeSheet().excelName }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            @for (section of activeSheet().sections; track section.title) {
              <div class="rounded-lg border border-border bg-background overflow-hidden">
                <!-- Cabecera de sección -->
                <div
                  class="px-3 py-2 bg-surface border-b border-border
                            flex items-center justify-between gap-2"
                >
                  <p class="font-semibold text-sm text-foreground">{{ section.title }}</p>
                  <div class="flex items-center gap-3 text-xs text-muted">
                    <span>{{ section.headers.length }} col.</span>
                    <span class="font-medium" [class.text-green-600]="section.rows.length > 0">
                      {{ section.rows.length > 0 ? section.rows.length + ' filas' : 'Sin datos' }}
                    </span>
                  </div>
                </div>

                <!-- Tabla -->
                <div class="overflow-x-auto max-h-96">
                  <table class="min-w-full text-sm">
                    <thead class="sticky top-0 z-10">
                      <tr class="bg-surface">
                        <th
                          class="border-b border-r border-border px-2 py-1.5 text-left
                                   font-semibold text-muted text-xs w-8"
                        >
                          #
                        </th>
                        @for (header of section.headers; track header) {
                          <th
                            class="border-b border-r border-border px-3 py-2 text-left
                                   font-semibold text-foreground whitespace-nowrap text-xs"
                          >
                            {{ header }}
                          </th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of visibleRows(section); track $index) {
                        <tr
                          class="transition-colors"
                          [class.bg-background]="$index % 2 === 0"
                          [class.bg-surface]="$index % 2 !== 0"
                        >
                          <td
                            class="border-b border-r border-border px-2 py-1.5
                                     text-muted text-xs text-center"
                          >
                            {{ $index + 1 }}
                          </td>
                          @for (cell of row; track $index) {
                            <td
                              class="border-b border-r border-border px-3 py-1.5
                                     text-foreground whitespace-nowrap text-xs"
                            >
                              {{ cell || '—' }}
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <!-- Footer con total de filas cuando hay muchas -->
                @if (section.rows.length > 10) {
                  <div
                    class="px-3 py-1.5 border-t border-border bg-surface text-xs text-muted text-right"
                  >
                    Mostrando {{ section.rows.length }} filas
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </ion-content>
  `,
})
export default class FullReportPage {
  private static readonly SCF_STATE_KEY = 'enric_scf_full_report_state';

  private globalExcelService = inject(GlobalExcelService);
  private router = inject(Router);
  private reportStore = inject(ReportStore);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  sourceReportRows = this.reportStore.rows;
  sourceReportCount = this.reportStore.count;

  scfSheets = signal<ScfSheetData[]>(this.globalExcelService.createScfSheetsData());
  selectedSheetId = signal<string>(this.scfSheets()[0]?.id ?? 'DATOS_GENERALES');
  isLoading = signal(false);
  loadingMessage = signal('');

  activeSheet = computed(
    () => this.scfSheets().find((s) => s.id === this.selectedSheetId()) ?? this.scfSheets()[0],
  );

  actuacionesTableCount = computed(() => {
    const sheet = this.scfSheets().find((s) => s.id === 'ACTUACIONES_DIARIAS');
    const section = sheet?.sections.find((s) => s.title === 'ACTUACIONES_DIARIAS');
    return section?.rows.length ?? 0;
  });

  constructor() {
    addIcons({
      arrowBack,
      cloudUploadOutline,
      downloadOutline,
      swapHorizontalOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
    });

    this.restoreScfState();
  }

  async exportScf() {
    const filename = await this.askExportFilename();
    if (!filename) {
      return;
    }

    this.setLoading(true, 'Generando fichero SCF…');
    try {
      await this.globalExcelService.exportScfWorkbook(this.scfSheets(), filename);
      this.showToast('SCF exportado correctamente ✓', 'success');
    } catch (error) {
      console.error('SCF export error:', error);
      this.showToast('Error al exportar el SCF', 'danger');
    } finally {
      this.setLoading(false);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.showToast('Solo se aceptan ficheros .xlsx', 'danger');
      target.value = '';
      return;
    }

    this.setLoading(true, `Importando ${file.name}…`);
    try {
      const importedSheets = await this.globalExcelService.importScfWorkbook(file);
      this.scfSheets.set(importedSheets);
      this.selectedSheetId.set(importedSheets[0]?.id ?? 'DATOS_GENERALES');
      await this.persistScfState();

      const totalRows = this.countAllRows(importedSheets);
      this.showToast(`SCF importado — ${totalRows} filas cargadas ✓`, 'success');
    } catch (error) {
      console.error('SCF import error:', error);
      this.showToast('Error al importar el SCF. Comprueba el formato del fichero.', 'danger');
    } finally {
      target.value = '';
      this.setLoading(false);
    }
  }

  selectSheet(sheetId: string) {
    this.selectedSheetId.set(sheetId);
  }

  async moveActuacionesData() {
    const rows = this.globalExcelService.mapGlobalRowsToActuacionesRows(this.sourceReportRows());
    if (rows.length === 0) {
      this.showToast('No hay datos de reportes para mover', 'warning');
      return;
    }

    const currentRows = this.getSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS');

    if (currentRows.length === 0) {
      this.updateSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS', rows);
      this.showToast(`${rows.length} filas movidas a ACTUACIONES DIARIAS`, 'success');
      return;
    }

    const decision = await this.askMoveMode();
    if (decision === 'cancel') {
      return;
    }

    const mergedRows = decision === 'replace' ? rows : [...currentRows, ...rows];
    this.updateSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS', mergedRows);

    const actionText = decision === 'replace' ? 'reemplazadas' : 'agregadas';
    this.showToast(`${rows.length} filas ${actionText} en ACTUACIONES DIARIAS`, 'success');
  }

  sheetLabel(sheetId: string): string {
    return sheetId.replace(/_/g, ' ');
  }

  visibleRows(section: ScfSectionData): string[][] {
    if (section.rows.length > 0) return section.rows;
    return Array.from({ length: Math.min(section.emptyRows, 4) }, () =>
      Array(section.headers.length).fill(''),
    );
  }

  sheetRowCount(sheet: ScfSheetData): number {
    return sheet.sections.reduce((acc, s) => acc + s.rows.length, 0);
  }

  private updateSectionRows(sheetId: string, sectionTitle: string, rows: string[][]) {
    this.scfSheets.update((current) =>
      current.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;
        return {
          ...sheet,
          sections: sheet.sections.map((section) => {
            if (section.title !== sectionTitle) return section;
            return { ...section, rows };
          }),
        };
      }),
    );

    this.persistScfState();
  }

  private getSectionRows(sheetId: string, sectionTitle: string): string[][] {
    const sheet = this.scfSheets().find((s) => s.id === sheetId);
    const section = sheet?.sections.find((s) => s.title === sectionTitle);
    return section?.rows ?? [];
  }

  private async askMoveMode(): Promise<'replace' | 'append' | 'cancel'> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'ACTUACIONES DIARIAS',
        message: 'Ya existen datos en la tabla. ¿Quieres reemplazar o agregar?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve('cancel'),
          },
          {
            text: 'Reemplazar',
            role: 'destructive',
            handler: () => resolve('replace'),
          },
          {
            text: 'Agregar',
            handler: () => resolve('append'),
          },
        ],
      });

      await alert.present();
    });
  }

  private async askExportFilename(): Promise<string | null> {
    const suggestedFilename = this.globalExcelService.getDefaultScfFilename();

    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Exportar SCF',
        message: 'Confirma el nombre del archivo antes de generarlo.',
        inputs: [
          {
            name: 'filename',
            type: 'text',
            value: suggestedFilename,
            placeholder: 'SCF-dd-MM-yy.xlsx',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(null),
          },
          {
            text: 'OK',
            handler: (data) => {
              const filename = (data?.filename ?? '').trim();
              if (!filename) {
                resolve(suggestedFilename);
                return;
              }

              resolve(filename.toLowerCase().endsWith('.xlsx') ? filename : `${filename}.xlsx`);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  private async restoreScfState() {
    try {
      const { value } = await Preferences.get({ key: FullReportPage.SCF_STATE_KEY });
      if (!value) {
        return;
      }

      const parsed = JSON.parse(value) as ScfSheetData[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return;
      }

      this.scfSheets.set(parsed);
      this.selectedSheetId.set(parsed[0]?.id ?? 'DATOS_GENERALES');
    } catch (error) {
      console.error('Error restoring SCF state:', error);
    }
  }

  private async persistScfState() {
    try {
      await Preferences.set({
        key: FullReportPage.SCF_STATE_KEY,
        value: JSON.stringify(this.scfSheets()),
      });
    } catch (error) {
      console.error('Error persisting SCF state:', error);
    }
  }

  private countAllRows(sheets: ScfSheetData[]): number {
    return sheets.reduce(
      (total, sheet) => total + sheet.sections.reduce((acc, s) => acc + s.rows.length, 0),
      0,
    );
  }

  private setLoading(active: boolean, message = '') {
    this.isLoading.set(active);
    this.loadingMessage.set(message);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}

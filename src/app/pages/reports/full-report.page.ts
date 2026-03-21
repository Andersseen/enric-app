import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { GlobalExcelService } from '@service/global-excel.service';
import { ReportStore } from '@service/report-store';
import { addIcons } from 'ionicons';
import { arrowBack, downloadOutline, swapHorizontalOutline } from 'ionicons/icons';

interface SheetSection {
  title: string;
  headers: string[];
  emptyRows?: number;
}

interface SheetTab {
  id: string;
  title: string;
  sections: SheetSection[];
}

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
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-surface p-4 rounded-lg shadow-sm border border-border"
      >
        <div class="text-sm text-muted min-h-6 flex items-center">
          Registros para ACTUACIONES_DIARIAS: <span class="font-bold">{{ count() }}</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          @if (activeSheet().id === 'ACTUACIONES_DIARIAS') {
            <ion-button
              color="secondary"
              fill="outline"
              (click)="moveActuacionesData()"
              [disabled]="count() === 0 || showMovedData()"
            >
              <ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>
              Mover data
            </ion-button>
          }
          <ion-button color="primary" (click)="exportScf()">
            <ion-icon slot="start" name="download-outline"></ion-icon>
            Exportar SCF
          </ion-button>
        </div>
      </div>
      <div class="flex flex-col gap-4 text-foreground">
        <div class="bg-surface border border-border rounded-xl p-2">
          <div
            role="radiogroup"
            aria-label="Hojas SCF"
            class="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            @for (sheet of sheets; track sheet.id) {
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
                      @if (shouldRenderMovedData(section)) {
                        @for (row of actuacionesPreviewRows(); track $index) {
                          <tr>
                            @for (cell of row; track $index) {
                              <td
                                class="border-b border-r border-border px-3 py-2 bg-background text-foreground whitespace-nowrap"
                              >
                                {{ cell }}
                              </td>
                            }
                          </tr>
                        }
                      } @else {
                        @for (rowIndex of emptyRowIndexes(section.emptyRows ?? 6); track rowIndex) {
                          <tr>
                            @for (header of section.headers; track header) {
                              <td class="border-b border-r border-border px-3 py-3 bg-background">
                                &nbsp;
                              </td>
                            }
                          </tr>
                        }
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

  rows = this.reportStore.rows;
  count = this.reportStore.count;
  showMovedData = signal(false);
  actuacionesPreviewRows = computed(() => {
    return this.rows().map((row) => [
      row.date || '',
      row.time || '',
      row.weather || '',
      row.worker || '',
      row.zoneId || '',
      row.speciesId || '',
      String(row.count ?? 0),
      row.behavior || '',
      row.actionType || '',
      row.operation || '',
      row.interaction || '',
      row.method || '',
      row.animal || '',
      row.efficacy || '',
      String(row.captured ?? 0),
      row.notes || '',
    ]);
  });

  sheets: SheetTab[] = [
    {
      id: 'DATOS_GENERALES',
      title: 'Datos base de asignación y animales en servicio.',
      sections: [
        {
          title: 'ASIGNACIÓN',
          headers: ['Asignación', 'Categoría', 'Nombre', 'Alta', 'Baja'],
          emptyRows: 4,
        },
        {
          title: 'ANIMALES EN SERVICIO - AVES',
          headers: [
            'Nº',
            'Especie',
            'Anilla/Microchip',
            'Nombre',
            'Modalidad de vuelo',
            'Fecha Alta',
            'Fecha Baja',
            'Motivo baja',
          ],
          emptyRows: 12,
        },
        {
          title: 'ANIMALES EN SERVICIO - PERROS',
          headers: [
            'Nº',
            'Especie',
            'Microchip',
            'Nombre',
            'Fecha Alta',
            'Fecha Baja',
            'Motivo baja',
          ],
          emptyRows: 12,
        },
      ],
    },
    {
      id: 'ACTUACIONES_DIARIAS',
      title: 'Hoja operativa con los registros de actuación.',
      sections: [
        {
          title: 'ACTUACIONES_DIARIAS',
          headers: [
            'Fecha',
            'Hora',
            'Climatología',
            'Personal',
            'Localización',
            'Especie',
            'Nº',
            'Actitud',
            'Tipo actuación',
            'Operación',
            'Interacción operación',
            'Método empleado',
            'Animal empleado',
            'Eficacia',
            'Captura (Nº indiv)',
            'Observaciones',
          ],
        },
      ],
    },
    {
      id: 'RETIRADAS_ANIMAL',
      title: 'Retiradas y rescates de fauna.',
      sections: [
        {
          title: 'RETIRADA DE RESTOS DE FAUNA',
          headers: [
            'Fecha',
            'Hora',
            'Localización',
            'Cód. lugar',
            'Especie',
            'Nº',
            'Causa',
            'Observaciones',
          ],
          emptyRows: 6,
        },
        {
          title: 'RESCATE DE OTROS ANIMALES EN EL AREA DE MOVIMIENTO',
          headers: [
            'Fecha',
            'Hora',
            'Localización',
            'Cód. lugar',
            'Especie',
            'Nº',
            'Método empleado',
            'Observaciones',
          ],
          emptyRows: 6,
        },
      ],
    },
    {
      id: 'SEGUIMIENTO',
      title: 'Seguimientos de vegetación y focos de atracción.',
      sections: [
        {
          title: 'SEGUIMIENTO DE LAS ACTUACIONES EN VEGETACIÓN',
          headers: ['Fecha', 'Hora', 'Descripción'],
          emptyRows: 6,
        },
        {
          title: 'SEGUIMIENTO DE FOCOS/PUNTOS ATRACTIVOS',
          headers: ['Foco/Punto atractivos', 'Fecha', 'Hora', 'Descripción'],
          emptyRows: 8,
        },
        {
          title: 'DETECCIÓN DE FOCOS/PUNTO DE ATRACCIÓN',
          headers: ['Fecha', 'Hora', 'Descripción'],
          emptyRows: 5,
        },
      ],
    },
    {
      id: 'REVISION_VALLADO',
      title: 'Control de incidencias y reparaciones de vallado.',
      sections: [
        {
          title: 'REVISIÓN DEL VALLADO',
          headers: [
            'Fecha',
            'Localización',
            'Descripción',
            'Comunicado a',
            'Fecha de reparación',
            'Tipo de reparación',
          ],
          emptyRows: 8,
        },
      ],
    },
    {
      id: 'COLISIONES',
      title: 'Registro de impactos con aeronaves.',
      sections: [
        {
          title: 'IMPACTOS',
          headers: [
            'Fecha',
            'Hora',
            'Localización',
            'Cód. lugar',
            'Especie implicada',
            'Nº',
            'Detección de restos',
            'Descripción incidente',
            'Tipo aeronave',
            'Matrícula',
            'Consecuencia para la aeronave',
          ],
          emptyRows: 6,
        },
      ],
    },
    {
      id: 'AVISOS_TWR',
      title: 'Comunicaciones con torre y otros colectivos.',
      sections: [
        {
          title: 'AVISOS DE/A TORRE U OTROS COLECTIVOS',
          headers: ['Fecha', 'Hora', 'Emisor/Receptor', 'Descripción de comunicación', 'Detalles'],
          emptyRows: 8,
        },
      ],
    },
  ];

  selectedSheetId = signal<string>(this.sheets[0].id);
  activeSheet = computed(() => {
    return this.sheets.find((sheet) => sheet.id === this.selectedSheetId()) ?? this.sheets[0];
  });

  constructor() {
    addIcons({ arrowBack, downloadOutline, swapHorizontalOutline });
  }

  async exportScf() {
    try {
      await this.globalExcelService.exportScfWorkbook(this.rows());
      this.showToast('SCF exportado correctamente', 'success');
    } catch (error) {
      console.error('SCF export error:', error);
      this.showToast('Error al exportar SCF', 'danger');
    }
  }

  selectSheet(sheetId: string) {
    this.selectedSheetId.set(sheetId);
    if (sheetId !== 'ACTUACIONES_DIARIAS') {
      this.showMovedData.set(false);
    }
  }

  moveActuacionesData() {
    this.showMovedData.set(true);
  }

  sheetLabel(sheetId: string): string {
    return sheetId.replace(/_/g, ' ');
  }

  emptyRowIndexes(rows: number): number[] {
    return Array.from({ length: rows }, (_, index) => index);
  }

  shouldRenderMovedData(section: SheetSection): boolean {
    return (
      this.activeSheet().id === 'ACTUACIONES_DIARIAS' &&
      section.title === 'ACTUACIONES_DIARIAS' &&
      this.showMovedData() &&
      this.actuacionesPreviewRows().length > 0
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

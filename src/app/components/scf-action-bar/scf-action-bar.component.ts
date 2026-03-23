import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  cloudUploadOutline,
  downloadOutline,
  swapHorizontalOutline,
  trashBinOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-scf-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon],
  template: `
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3
                bg-surface p-4 rounded-lg shadow-sm border border-border"
    >
      <!-- Contador de filas -->
      <div class="text-sm text-muted min-h-6 flex items-center gap-1">
        Filas en ACTUACIONES DIARIAS:
        <span class="font-bold text-foreground">{{ actuacionesTableCount }}</span>
        @if (actuacionesTableCount > 0) {
          <ion-icon name="checkmark-circle-outline" class="text-green-500 text-base"></ion-icon>
        }
      </div>

      <!-- Botones -->
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          #fileInput
          type="file"
          accept=".xlsx"
          (change)="onFileInputChange($event)"
          style="display: none"
        />

        @if (activeSheetId === 'ACTUACIONES_DIARIAS') {
          <ion-button
            color="secondary"
            fill="outline"
            (click)="moveData.emit()"
            [disabled]="sourceReportCount === 0"
          >
            <ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>
            Mover data ({{ sourceReportCount }})
          </ion-button>
        }

        <ion-button
          fill="outline"
          color="primary"
          (click)="fileInput.click()"
          [disabled]="isLoading"
        >
          <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
          Importar SCF
        </ion-button>

        <ion-button
          fill="outline"
          color="danger"
          (click)="clearTables.emit()"
          [disabled]="isLoading"
        >
          <ion-icon slot="start" name="trash-bin-outline"></ion-icon>
          Limpiar tablas
        </ion-button>

        <ion-button color="primary" (click)="exportScf.emit()" [disabled]="isLoading">
          <ion-icon slot="start" name="download-outline"></ion-icon>
          Exportar SCF
        </ion-button>
      </div>
    </div>

    <!-- Loading overlay -->
    @if (isLoading) {
      <div class="flex items-center justify-center gap-2 text-sm text-muted py-2">
        <span
          class="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
        ></span>
        {{ loadingMessage }}
      </div>
    }
  `,
})
export class ScfActionBarComponent {
  @Input() isLoading = false;
  @Input() loadingMessage = '';
  @Input() activeSheetId = '';
  @Input() sourceReportCount = 0;
  @Input() actuacionesTableCount = 0;

  @Output() importFile = new EventEmitter<File>();
  @Output() moveData = new EventEmitter<void>();
  @Output() clearTables = new EventEmitter<void>();
  @Output() exportScf = new EventEmitter<void>();

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  constructor() {
    addIcons({
      cloudUploadOutline,
      downloadOutline,
      swapHorizontalOutline,
      trashBinOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
    });
  }

  onFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.importFile.emit(file);
    }
    target.value = '';
  }
}

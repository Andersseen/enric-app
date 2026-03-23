import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-scf-row-edit-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonFooter,
  ],
  template: `
    <ion-modal
      [isOpen]="isOpen"
      [breakpoints]="[0, 0.9, 1]"
      [initialBreakpoint]="0.9"
      [handle]="true"
      (ionModalDidDismiss)="cancelled.emit()"
    >
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ row === null ? 'Nueva fila' : 'Editar fila' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="cancelled.emit()" color="medium">
                <ion-icon name="close-outline" slot="icon-only" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="flex flex-col gap-0 divide-y divide-border">
            @for (header of headers; track $index) {
              <ion-item lines="none" class="py-1">
                <ion-label position="stacked" class="text-xs font-semibold text-muted mb-1">
                  {{ header }}
                </ion-label>
                <ion-input
                  [(ngModel)]="formRow[$index]"
                  [placeholder]="header"
                  class="text-sm"
                  clearInput
                />
              </ion-item>
            }
          </div>
        </ion-content>

        <ion-footer class="ion-padding flex flex-col gap-2">
          @if (row !== null) {
            <ion-button
              expand="block"
              fill="outline"
              color="danger"
              (click)="onDelete()"
            >
              <ion-icon name="trash-outline" slot="start" />
              Eliminar fila
            </ion-button>
          }
          <ion-button expand="block" color="primary" (click)="onSave()">
            Guardar
          </ion-button>
        </ion-footer>
      </ng-template>
    </ion-modal>
  `,
})
export class ScfRowEditModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() headers: string[] = [];
  /** null = new row; string[] = existing row values */
  @Input() row: string[] | null = null;

  @Output() saved = new EventEmitter<string[]>();
  @Output() deleted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formRow: string[] = [];

  constructor() {
    addIcons({ closeOutline, trashOutline });
  }

  ngOnChanges(): void {
    // Re-initialise the form copy every time inputs change
    if (this.isOpen) {
      this.formRow = this.row ? [...this.row] : Array(this.headers.length).fill('');
    }
  }

  onSave() {
    this.saved.emit([...this.formRow]);
  }

  onDelete() {
    this.deleted.emit();
  }
}

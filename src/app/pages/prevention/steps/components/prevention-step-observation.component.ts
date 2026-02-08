import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevention-step-observation',
  imports: [IonCard, IonCardContent, IonButton, IonIcon, IonTextarea, FormsModule],
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">Observaciones</h2>

        <ion-textarea
          label="Detalles"
          labelPlacement="floating"
          fill="outline"
          rows="10"
          placeholder="Escribe aquí las observaciones..."
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit($event)"
        ></ion-textarea>

        <div class="mt-6">
          <ion-button expand="block" (click)="save.emit()">
            Guardar en Tabla
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepObservationComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();

  constructor() {
    addIcons({ saveOutline });
  }
}

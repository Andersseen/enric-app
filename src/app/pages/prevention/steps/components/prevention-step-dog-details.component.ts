import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonTextarea,
} from '@ionic/angular/standalone';
import AnimalPickerComponent from '@components/forms/animal-picker';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevention-step-dog-details',
  imports: [
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonTextarea,
    FormsModule,
    AnimalPickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">Detalles</h2>

        <div class="flex flex-col gap-4">
          <div>
            <p class="text-sm font-medium mb-1">Animal empleado</p>
            <app-animal-picker
              kind="dog"
              [value]="animal"
              (valueChange)="animal = $event; animalChange.emit($event)"
            />
          </div>

          <ion-textarea
            label="Observaciones"
            labelPlacement="floating"
            fill="outline"
            rows="5"
            placeholder="Escribe aquí los detalles..."
            [(ngModel)]="notes"
            (ngModelChange)="notesChange.emit($event)"
          ></ion-textarea>
        </div>

        <div class="mt-6">
          <ion-button expand="block" (click)="save.emit()" [disabled]="!isValid()">
            Guardar en Tabla
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepDogDetailsComponent {
  @Input() animal: string = '';
  @Output() animalChange = new EventEmitter<string>();

  @Input() notes: string = '';
  @Output() notesChange = new EventEmitter<string>();

  @Output() save = new EventEmitter<void>();

  constructor() {
    addIcons({ saveOutline });
  }

  isValid() {
    return this.animal.trim().length > 0;
  }
}

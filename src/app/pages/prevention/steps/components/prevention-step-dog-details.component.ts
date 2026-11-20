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
} from '@ionic/angular';
import AnimalPickerComponent from '@components/forms/animal-picker';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

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
        <h2 class="text-xl font-bold mb-4">{{ t('common.details') }}</h2>

        <div class="flex flex-col gap-4">
          <div>
            <p class="text-sm font-medium mb-1">{{ t('common.animalUsed') }}</p>
            <app-animal-picker
              kind="dog"
              [value]="animal"
              (valueChange)="animal = $event; animalChange.emit($event)"
            />
          </div>

          <ion-textarea
            [label]="t('common.observations')"
            labelPlacement="floating"
            fill="outline"
            rows="5"
            [placeholder]="t('common.writeDetails')"
            [(ngModel)]="notes"
            (ngModelChange)="notesChange.emit($event)"
          ></ion-textarea>
        </div>

        <div class="mt-6">
          <ion-button expand="block" (click)="save.emit()" [disabled]="!isValid()">
            {{ t('common.saveToTable') }}
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepDogDetailsComponent {
  protected t = injectT(i18n);
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

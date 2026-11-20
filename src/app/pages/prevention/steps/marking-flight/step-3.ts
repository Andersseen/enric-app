import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';
import { PreventionStep } from '../base-step';
import PreventionStepPage from '../prevention-step-page';
import AnimalPickerComponent from '@components/forms/animal-picker';

@Component({
  selector: 'app-flight-step-three',
  imports: [PreventionStepPage, AnimalPickerComponent, IonButton, IonIcon, IonCard, IonCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-prevention-step-page title="Animal Empleado">
      <div class="p-4 flex flex-col gap-4">
        <ion-card>
          <ion-card-content>
            <app-animal-picker
              kind="falcon"
              [value]="animalName"
              (valueChange)="updateAnimal($event)"
            />
          </ion-card-content>
        </ion-card>

        <ion-button
          expand="block"
          (click)="next()"
          [disabled]="!animalName || animalName.trim() === ''"
          class="mt-4"
        >
          Siguiente
          <ion-icon slot="end" name="arrow-forward"></ion-icon>
        </ion-button>
      </div>
    </app-prevention-step-page>
  `,
})
export default class FlightStepThree extends PreventionStep {
  animalName = this.store.flightReviewAnimal();

  constructor() {
    super();
    addIcons({ arrowForward });
  }

  updateAnimal(value: string) {
    this.animalName = value;
    this.store.flightReviewAnimal.set(value);
  }

  next() {
    this.router.navigate(['home', 'prevention', 'marking-flight', 'step-4']);
  }
}

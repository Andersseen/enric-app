import { Component, input, output } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import type { BirdItem } from '@data/bird';

@Component({
  selector: 'app-bird-card',
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon],
  template: `
    @if(bird()){
    <ion-card
      class="relative flex justify-between group overflow-hidden rounded-xl border cursor-pointer p-4"
      role="button"
      tabindex="0"
      (click)="select.emit(bird())"
      (keydown.enter)="select.emit(bird())"
      (keydown.space)="select.emit(bird())"
      [attr.aria-pressed]="selected()"
      [attr.aria-label]="'Seleccionar ' + bird().commonName"
    >
      <div class="min-w-0 pr-2">
        <ion-card-header
          ><ion-card-title class="text-md truncate">{{
            bird().commonName
          }}</ion-card-title></ion-card-header
        >
        <ion-card-content class="text-sm text-muted truncate">{{
          bird().scientificName
        }}</ion-card-content>
      </div>

      <div class="flex items-start gap-2">
        <ion-button
          fill="clear"
          (click)="toggleFavorite.emit(bird()); $event.stopPropagation()"
          aria-label="Favorito"
        >
          <ion-icon [name]="bird().favorite ? 'star' : 'star-outline'"></ion-icon>
        </ion-button>

        <button
          class="rounded-full p-2"
          (click)="toggleSelect.emit(bird()); $event.stopPropagation()"
          aria-label="Seleccionar"
        >
          <ion-icon [name]="selected() ? 'checkmark' : ''"></ion-icon>
        </button>
      </div>
    </ion-card>
    }
  `,
})
export default class BirdCardComponent {
  readonly bird = input<BirdItem>({} as BirdItem);
  readonly selected = input<boolean>(false);

  readonly select = output<BirdItem>();
  readonly toggleSelect = output<BirdItem>();
  readonly toggleFavorite = output<BirdItem>();
}

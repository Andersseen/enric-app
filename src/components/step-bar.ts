import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { type Step } from '@data/steps';
import { IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircle } from 'ionicons/icons';
import { StoreService } from 'src/service/state';

@Component({
  selector: 'app-step-bar',
  imports: [IonTabBar, IonTabButton, IonIcon, NgClass],
  template: `
    <ion-tab-bar slot="bottom">
      @for (item of steps(); track $index) {
      <ion-tab-button
        [tab]="item.id"
        [ngClass]="{ 'bg-primary text-background': selectedStep() === item.id }"
        [disabled]="selectedStep() !== item.id"
      >
        <ion-icon [name]="item.icon" />
        {{ item.title }}
      </ion-tab-button>
      }
    </ion-tab-bar>
  `,
})
export default class StepBar {
  #store = inject(StoreService);
  constructor() {
    addIcons({ playCircle });
  }
  selectedStep = computed(() => this.#store.currentStep());
  steps = input.required<Step[]>();
}

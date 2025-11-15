import { Component, computed, inject, input } from '@angular/core';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import SessionHeaderComponent from './session-header';
import { addIcons } from 'ionicons';
import { caretBack, caretForward } from 'ionicons/icons';
import { Router } from '@angular/router';
import StoreService from '@service/state';
import { STEP_ID } from '@data/steps';

@Component({
  selector: 'app-step-panel',
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    SessionHeaderComponent,
    IonButtons,
    IonContent,
    IonIcon,
    IonButton,
  ],
  template: `
    <section id="page" class="ion-page flex flex-col gap-4">
      <ion-header>
        <ion-toolbar class="flex">
          @if (currentStateStep().prev) {
          <ion-buttons slot="start" class="cursor-pointer">
            <ion-button (click)="goBack()">
              <ion-icon slot="icon-only" name="caret-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          }
          <ion-title class="text-center">{{ title() }}</ion-title>
          @if (currentStateStep().next && canGoForward()) {
          <ion-buttons slot="end" class="cursor-pointer">
            <ion-button (click)="goForward()">
              <ion-icon slot="icon-only" name="caret-forward"></ion-icon>
            </ion-button>
          </ion-buttons>
          }
        </ion-toolbar>

        <app-session-header />
      </ion-header>
      <ion-content class="ion-padding">
        <ng-content />
      </ion-content>
    </section>
  `,
})
export default class StepPanel {
  #store = inject(StoreService);
  #router = inject(Router);

  currentStateStep = computed(() => this.#store.currentStateStep());

  title = input<string>();

  canGoForward = input<boolean>();

  constructor() {
    addIcons({ caretBack, caretForward });
  }

  goBack() {
    this.#router.navigate(['/home/action', this.currentStateStep().prev]);
    this.#store.setCurrentStep(this.currentStateStep().prev as STEP_ID);
  }

  goForward() {
    this.#router.navigate(['/home/action', this.currentStateStep().next]);
    this.#store.setCurrentStep(this.currentStateStep().next as STEP_ID);
  }
}

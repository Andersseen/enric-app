import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import SessionHeaderComponent from '@components/session-header';
import { DogReviewStepId } from '@data/dog-review-data';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import PreventionStore from '@service/prevention-store';
import { addIcons } from 'ionicons';
import { caretBack, caretForward } from 'ionicons/icons';

@Component({
  selector: 'app-step-panel',
  imports: [IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonIcon, IonButton],
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
      </ion-header>
      <ion-content>
        <ng-content />
      </ion-content>
    </section>
  `,
})
export default class StepPanel {
  #store = inject(PreventionStore);
  #router = inject(Router);

  currentStateStep = computed(() => this.#store.currentStateStep());

  title = input<string>();

  canGoForward = input<boolean>();

  basePath = input<string>('/home/action');

  constructor() {
    addIcons({ caretBack, caretForward });
  }

  goBack() {
    this.#router.navigate([this.basePath(), this.currentStateStep().prev]);
    this.#store.setCurrentStep(this.currentStateStep().prev as DogReviewStepId);
  }

  goForward() {
    this.#router.navigate([this.basePath(), this.currentStateStep().next]);
    this.#store.setCurrentStep(this.currentStateStep().next as DogReviewStepId);
  }
}

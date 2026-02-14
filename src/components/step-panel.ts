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

import { StepId } from '@data/steps';
import ActionsStore from '@service/actions-store';

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
      <ion-header class="shadow-sm">
        <ion-toolbar class="flex py-3 min-h-20 --background: transperent">
          @if (currentStateStep().prev) {
            <ion-buttons slot="start" class="cursor-pointer ml-2">
              <ion-button
                (click)="goBack()"
                shape="round"
                class="w-14 h-14 bg-surface-variant/50 rounded-full"
                size="large"
              >
                <ion-icon slot="icon-only" name="caret-back" class="text-3xl"></ion-icon>
              </ion-button>
            </ion-buttons>
          }
          <ion-title class="text-center text-2xl font-bold tracking-wide">{{ title() }}</ion-title>
          @if (currentStateStep().next && canGoForward()) {
            <ion-buttons slot="end" class="cursor-pointer mr-2">
              <ion-button
                (click)="goForward()"
                shape="round"
                size="large"
                class="w-14 h-14 bg-surface-variant/50 rounded-full"
              >
                <ion-icon slot="icon-only" name="caret-forward" class="text-3xl"></ion-icon>
              </ion-button>
            </ion-buttons>
          }
        </ion-toolbar>

        <app-session-header />
      </ion-header>
      <ion-content>
        <ng-content />
      </ion-content>
    </section>
  `,
})
export default class StepPanel {
  #store = inject(ActionsStore);
  #router = inject(Router);

  currentStateStep = computed(() => this.#store.currentStateStep());

  title = input<string>();

  canGoForward = input<boolean>();

  basePath = input<string>('/home/action');

  constructor() {
    addIcons({ caretBack, caretForward });
  }

  goBack() {
    (document.activeElement as HTMLElement)?.blur();
    this.#router.navigate([this.basePath(), this.currentStateStep().prev]);
    this.#store.setCurrentStep(this.currentStateStep().prev as StepId);
  }

  goForward() {
    (document.activeElement as HTMLElement)?.blur();
    this.#router.navigate([this.basePath(), this.currentStateStep().next]);
    this.#store.setCurrentStep(this.currentStateStep().next as StepId);
  }
}

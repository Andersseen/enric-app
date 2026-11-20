import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import AnimalsStore, { AnimalKind } from '@service/animals-store';
import type { MessageKey } from '@i18n/i18n';
import { addIcons } from 'ionicons';
import { addOutline, arrowBack, trashOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

interface AnimalSection {
  kind: AnimalKind;
  title: MessageKey;
  inputLabel: MessageKey;
  empty: MessageKey;
  control: FormControl<string | null>;
}

@Component({
  selector: 'app-manage-animals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/home" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ t('animals.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="max-w-md mx-auto flex flex-col gap-8">
        @for (section of sections; track section.kind) {
          <section>
            <h2 class="text-lg font-semibold mb-3 text-foreground">{{ t(section.title) }}</h2>

            <div class="flex gap-2 mb-4 items-end">
              <ion-input
                [formControl]="section.control"
                [label]="t(section.inputLabel)"
                labelPlacement="floating"
                fill="outline"
                class="flex-1"
                (keyup.enter)="add(section)"
              ></ion-input>
              <ion-button (click)="add(section)" [disabled]="section.control.invalid">
                <ion-icon name="add-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>

            <ion-list class="rounded-xl border border-border overflow-hidden">
              @for (name of animals.list(section.kind); track name) {
                <ion-item>
                  <ion-label>{{ name }}</ion-label>
                  <ion-button
                    fill="clear"
                    color="danger"
                    slot="end"
                    (click)="remove(section, name)"
                  >
                    <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </ion-item>
              } @empty {
                <ion-item lines="none">
                  <ion-label class="text-center text-muted italic">{{ t(section.empty) }}</ion-label>
                </ion-item>
              }
            </ion-list>
          </section>
        }
      </div>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export default class ManageAnimalsPage {
  protected t = injectT(i18n);
  animals = inject(AnimalsStore);
  #toast = inject(ToastController);

  sections: AnimalSection[] = [
    {
      kind: 'falcon',
      title: 'animals.falcons',
      inputLabel: 'animals.newFalcon',
      empty: 'animals.noFalcons',
      control: new FormControl('', [Validators.required, Validators.minLength(2)]),
    },
    {
      kind: 'dog',
      title: 'animals.dogs',
      inputLabel: 'animals.newDog',
      empty: 'animals.noDogs',
      control: new FormControl('', [Validators.required, Validators.minLength(2)]),
    },
  ];

  constructor() {
    addIcons({ arrowBack, trashOutline, addOutline });
  }

  async add(section: AnimalSection) {
    const name = section.control.value?.trim();
    if (section.control.invalid || !name) return;

    const added = this.animals.add(section.kind, name);
    section.control.reset();
    await this.#showToast(
      added ? this.t('animals.added', { name }) : this.t('animals.exists', { name }),
      added ? 'success' : 'warning',
    );
  }

  async remove(section: AnimalSection, name: string) {
    this.animals.remove(section.kind, name);
    await this.#showToast(this.t('animals.removed', { name }), 'medium');
  }

  async #showToast(message: string, color: string) {
    const toast = await this.#toast.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}

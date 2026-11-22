import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { arrowBack, saveOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n, type MessageKey } from '@i18n/i18n';

export type ZoneLogKind = 'vigilance' | 'maintenance';

/**
 * Configuración de cada pantalla. `actionType` y `defaultNotes` van siempre en
 * castellano porque se guardan y salen tal cual en el Excel.
 */
const ZONE_LOGS: Record<
  ZoneLogKind,
  { actionType: string; defaultNotes: string; title: MessageKey; saved: MessageKey }
> = {
  vigilance: {
    actionType: 'Vigilancia',
    defaultNotes: 'Permanecemos en observación',
    title: 'vigilance.title',
    saved: 'vigilance.saved',
  },
  maintenance: {
    actionType: 'Mantenimiento',
    defaultNotes: 'Tareas de mantenimiento',
    title: 'maintenance.title',
    saved: 'maintenance.saved',
  },
};

/**
 * "VIGILANCIA" y "MANTENIMIENTO": registran una fila en ACTUACIONES DIARIAS
 * sin especie. Solo se indica la zona y las observaciones (con un texto por
 * defecto que se puede cambiar o borrar).
 */
@Component({
  selector: 'app-zone-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonTextarea,
    FormsModule,
    RouterLink,
    MapZones,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/home" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ t(config.title) }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-content>
          <h2 class="text-xl font-bold mb-4">{{ t('common.selectZone') }}</h2>
          <app-map-zones [selected]="zone()" (select)="zone.set($event)" />
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content class="flex flex-col gap-4">
          <ion-textarea
            [label]="t('common.observations')"
            labelPlacement="floating"
            fill="outline"
            rows="4"
            [placeholder]="t('common.writeDetails')"
            [ngModel]="notes()"
            (ngModelChange)="notes.set($event)"
          ></ion-textarea>

          <ion-button expand="block" (click)="save()" [disabled]="!zone()">
            {{ t('common.saveToTable') }}
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export default class ZoneLogPage {
  protected t = injectT(i18n);
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);
  #nav = inject(NavController);

  protected config = ZONE_LOGS[
    (inject(ActivatedRoute).snapshot.data['kind'] as ZoneLogKind) ?? 'vigilance'
  ];

  zone = signal<Zone | null>(null);
  // Texto por defecto, editable o borrable
  notes = signal(this.config.defaultNotes);

  constructor() {
    addIcons({ arrowBack, saveOutline });
  }

  async save() {
    const zone = this.zone();
    if (!zone) return;

    this.#reportStore.addRow({
      zoneId: zone.name,
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: this.config.actionType,
      operation: 'No',
      interaction: 'No',
      method: '-',
      animal: '',
      efficacy: '-',
      captured: 0,
      notes: this.notes().trim(),
      ...this.#session.recordMeta(),
    });

    const toast = await this.#toast.create({
      message: this.t(this.config.saved),
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    this.#nav.navigateRoot('/home');
  }
}

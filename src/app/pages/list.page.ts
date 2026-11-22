import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { BackupService } from '@service/backup.service';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular';
import LocaleService from '@service/locale.service';
import { APP_LOCALES, AppLocale } from '@i18n/i18n';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline, cloudUploadOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import ActionCards, { type ActionCardItem } from '@components/action-cards';
import SessionHeaderComponent from '@components/session-header';
import ThemeService from '@service/theme.service';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionCards,
    SessionHeaderComponent,
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
  template: `
    <ion-content class="ion-padding">
      <!-- Idioma -->
      <ion-segment
        class="mb-4"
        [value]="localeService.locale()"
        [attr.aria-label]="t('language.label')"
        (ionChange)="changeLocale($event.detail.value)"
      >
        @for (locale of locales; track locale) {
          <ion-segment-button [value]="locale">
            <ion-label>{{ localeName(locale) }}</ion-label>
          </ion-segment-button>
        }
      </ion-segment>

      <!-- Session Configuration -->
      <app-session-header class="mb-6" />

      <h2
        class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left text-foreground"
      >
        {{ t('home.mainActions') }}
      </h2>

      <app-action-cards [items]="mainActions()" />

      <div class="mt-8 pt-6 border-t border-border">
        <h3
          class="text-lg font-semibold tracking-tight mb-3 text-center md:text-left text-foreground"
        >
          {{ t('home.reports') }}
        </h3>
        <app-action-cards [items]="reportsSection()" />
      </div>

      <!-- Copia de seguridad -->
      <div class="mt-8 pt-6 pb-16 border-t border-border">
        <h3 class="text-lg font-semibold tracking-tight mb-1 text-center md:text-left text-foreground">
          {{ t('backup.title') }}
        </h3>
        <p class="text-sm text-muted-foreground mb-3 text-center md:text-left">
          {{ t('backup.description') }}
        </p>
        <div class="flex gap-2">
          <ion-button class="flex-1" fill="outline" (click)="exportBackup()">
            <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
            {{ t('backup.export') }}
          </ion-button>
          <ion-button class="flex-1" fill="outline" color="medium" (click)="backupInput.click()">
            <ion-icon slot="start" name="cloud-download-outline"></ion-icon>
            {{ t('backup.import') }}
          </ion-button>
        </div>
        <input
          #backupInput
          type="file"
          accept="application/json,.json"
          class="hidden"
          (change)="importBackup($event)"
        />
      </div>

      <!-- Theme Toggle FAB -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button
          (click)="toggleTheme()"
          color="medium"
          size="small"
          [attr.aria-label]="t('home.toggleTheme')"
        >
          <ion-icon [name]="themeIcon()"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export default class List {
  protected t = injectT(i18n);
  themeService = inject(ThemeService);
  localeService = inject(LocaleService);
  locales = APP_LOCALES;
  #backup = inject(BackupService);
  #alerts = inject(AlertController);
  #toasts = inject(ToastController);

  // Computed signal for reactive icon
  themeIcon = computed(() =>
    this.themeService.theme() === 'dark' ? 'sunny-outline' : 'moon-outline',
  );

  constructor() {
    addIcons({ moonOutline, sunnyOutline, cloudDownloadOutline, cloudUploadOutline });
  }

  mainActions = computed<ActionCardItem[]>(() => [
    {
      icon: '🧰',
      title: this.t('home.cards.prevention.title'),
      description: this.t('home.cards.prevention.description'),
      routerLink: ['prevention'],
      color: 'primary',
    },
    {
      icon: '🚨',
      title: this.t('home.cards.acting.title'),
      description: this.t('home.cards.acting.description'),
      routerLink: ['action'],
      color: 'secondary',
    },
    {
      icon: '🎯',
      title: this.t('home.cards.traps.title'),
      description: this.t('home.cards.traps.description'),
      routerLink: ['traps'],
      color: 'primary',
    },
    {
      icon: '👁️',
      title: this.t('home.cards.vigilance.title'),
      description: this.t('home.cards.vigilance.description'),
      routerLink: ['vigilance'],
      color: 'secondary',
    },
    {
      icon: '🛠️',
      title: this.t('home.cards.maintenance.title'),
      description: this.t('home.cards.maintenance.description'),
      routerLink: ['maintenance'],
      color: 'primary',
    },
  ]);

  reportsSection = computed<ActionCardItem[]>(() => [
    {
      icon: '📊',
      title: this.t('home.cards.myReports.title'),
      description: this.t('home.cards.myReports.description'),
      routerLink: ['/reports'],
      color: 'primary',
    },
    {
      icon: '📚',
      title: this.t('home.cards.fullReport.title'),
      description: this.t('home.cards.fullReport.description'),
      routerLink: ['/reporte-entero'],
      color: 'secondary',
    },
    {
      icon: '👷',
      title: this.t('home.cards.workers.title'),
      description: this.t('home.cards.workers.description'),
      routerLink: ['/home/manage-workers'],
      color: 'secondary',
    },
    {
      icon: '🦅',
      title: this.t('home.cards.animals.title'),
      description: this.t('home.cards.animals.description'),
      routerLink: ['/home/manage-animals'],
      color: 'secondary',
    },
  ]);

  localeName(locale: AppLocale): string {
    return this.t(`language.${locale}`);
  }

  changeLocale(value: unknown): void {
    if (APP_LOCALES.includes(value as AppLocale)) {
      this.localeService.setLocale(value as AppLocale);
    }
  }

  async exportBackup(): Promise<void> {
    try {
      await this.#backup.export();
      this.#toast(this.t('backup.exported'), 'success');
    } catch (error) {
      // Cerrar el menú de compartir sin elegir nada no es un error
      if (String(error).toLowerCase().includes('cancel')) return;
      console.error('Backup export error:', error);
      this.#toast(this.t('backup.exportError'), 'danger');
    }
  }

  async importBackup(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const alert = await this.#alerts.create({
      message: this.t('backup.confirmImport'),
      buttons: [
        { text: this.t('common.cancel'), role: 'cancel' },
        { text: this.t('backup.restore'), role: 'confirm' },
      ],
    });
    await alert.present();
    if ((await alert.onDidDismiss()).role !== 'confirm') return;

    try {
      await this.#backup.import(file);
      // Se recarga la app para que todas las pantallas lean los datos restaurados
      window.location.reload();
    } catch (error) {
      console.error('Backup import error:', error);
      this.#toast(this.t('backup.importError'), 'danger');
    }
  }

  async #toast(message: string, color: string): Promise<void> {
    const toast = await this.#toasts.create({ message, color, duration: 2500, position: 'bottom' });
    await toast.present();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import ActionsStore from '@service/actions-store';
import PreventionStore from '@service/prevention-store';
import TrapsActionsStore from '@service/traps-store';
import { Router } from '@angular/router';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  AlertController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  home,
  flash,
  shieldCheckmark,
  homeOutline,
  flashOutline,
  shieldCheckmarkOutline,
  aperture,
  apertureOutline,
} from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-bottom-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tab-bar slot="bottom" style="margin-bottom: 3rem;">
      @for (item of tabs; track item.tab) {
        <ion-tab-button (click)="navigate(item.path)" [class.selected-tab]="isActive(item.path)">
          <ion-icon [name]="isActive(item.path) ? item.selectedIcon : item.icon"></ion-icon>
          <ion-label>{{ t(item.label) }}</ion-label>
        </ion-tab-button>
      }
    </ion-tab-bar>
  `,
  styles: [
    `
      .selected-tab {
        --color: var(--ion-color-primary);
        --background: var(--ion-color-light);
      }
    `,
  ],
})
export class BottomBarComponent {
  protected t = injectT(i18n);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  actionsStore = inject(ActionsStore);
  preventionStore = inject(PreventionStore);
  trapsStore = inject(TrapsActionsStore);

  tabs = [
    {
      tab: 'home',
      path: '/home',
      label: 'nav.home' as const,
      icon: 'home-outline',
      selectedIcon: 'home',
    },
    {
      tab: 'prevention',
      path: '/home/prevention',
      label: 'nav.prevention' as const,
      icon: 'shield-checkmark-outline',
      selectedIcon: 'shield-checkmark',
    },
    {
      tab: 'action',
      path: '/home/action',
      label: 'nav.acting' as const,
      icon: 'flash-outline',
      selectedIcon: 'flash',
    },
    {
      tab: 'traps',
      path: '/home/traps',
      label: 'nav.traps' as const,
      icon: 'aperture-outline',
      selectedIcon: 'aperture',
    },
  ];

  constructor() {
    addIcons({
      home,
      flash,
      shieldCheckmark,
      homeOutline,
      flashOutline,
      shieldCheckmarkOutline,
      aperture,
      apertureOutline,
    });
  }

  isActive(path: string) {
    return path === '/home' ? this.router.url === '/home' : this.router.url.includes(path);
  }

  async navigate(path: string) {
    const currentUrl = this.router.url;

    const isActing = currentUrl.includes('/home/action');
    const isPrevention = currentUrl.includes('/home/prevention');
    const isTraps = currentUrl.includes('/home/traps');

    const targetIsAction = path.includes('/action');
    const targetIsPrevention = path.includes('/prevention');
    const targetIsTraps = path.includes('/traps');
    const targetIsHome = path === '/home';

    if (
      (isActing && targetIsAction) ||
      (isPrevention && targetIsPrevention) ||
      (isTraps && targetIsTraps)
    ) {
      return;
    }

    if (currentUrl === '/home' && targetIsHome) {
      return;
    }

    const navigateFn = () => {
      if (targetIsAction) {
        this.actionsStore.resetState();
        this.router.navigate(['home', 'action', 'step-1']);
        return;
      }
      if (targetIsTraps) {
        this.trapsStore.resetState();
        this.router.navigate(['home', 'traps', 'step-1']);
        return;
      }
      if (targetIsPrevention) {
        this.preventionStore.resetState();
        this.router.navigate(['home', 'prevention']);
        return;
      }
      this.actionsStore.resetState();
      this.trapsStore.resetState();
      this.preventionStore.resetState();
      this.router.navigate([path]);
    };

    if (isActing || isPrevention || isTraps) {
      const alert = await this.alertCtrl.create({
        header: this.t('nav.exitTitle'),
        message: this.t('nav.exitMessage'),
        buttons: [
          {
            text: this.t('common.cancel'),
            role: 'cancel',
          },
          {
            text: this.t('common.exit'),
            role: 'confirm',
            handler: () => {
              navigateFn();
            },
          },
        ],
      });
      await alert.present();
    } else {
      navigateFn();
    }
  }
}

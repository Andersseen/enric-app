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
} from '@ionic/angular/standalone';
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

@Component({
  selector: 'app-bottom-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tab-bar slot="bottom" style="margin-bottom: 3rem;">
      @for (item of tabs; track item.tab) {
        <ion-tab-button (click)="navigate(item.path)" [class.selected-tab]="isActive(item.path)">
          <ion-icon [name]="isActive(item.path) ? item.selectedIcon : item.icon"></ion-icon>
          <ion-label>{{ item.label }}</ion-label>
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
  router = inject(Router);
  alertCtrl = inject(AlertController);
  actionsStore = inject(ActionsStore);
  preventionStore = inject(PreventionStore);
  trapsStore = inject(TrapsActionsStore);

  tabs = [
    {
      tab: 'home',
      path: '/home',
      label: 'Inicio',
      icon: 'home-outline',
      selectedIcon: 'home',
    },
    {
      tab: 'prevention',
      path: '/home/prevention',
      label: 'Prevención',
      icon: 'shield-checkmark-outline',
      selectedIcon: 'shield-checkmark',
    },
    {
      tab: 'action',
      path: '/home/action',
      label: 'Actuación',
      icon: 'flash-outline',
      selectedIcon: 'flash',
    },
    {
      tab: 'traps',
      path: '/home/traps',
      label: 'Trampas',
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
        header: '¿Salir del proceso?',
        message: 'Si sales ahora, perderás los datos introducidos.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Salir',
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

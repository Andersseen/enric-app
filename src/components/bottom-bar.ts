import { Component, inject } from '@angular/core';
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
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tab-bar slot="bottom">
      @for (item of tabs; track item.tab) {
      <ion-tab-button
        [tab]="item.tab"
        (click)="navigate(item.path)"
        [class.selected-tab]="isActive(item.path)"
      >
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
      tab: 'tramps',
      path: '/home/tramps',
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

    const targetIsAction = path.includes('/action');
    const targetIsPrevention = path.includes('/prevention');
    const targetIsHome = path === '/home';

    if ((isActing && targetIsAction) || (isPrevention && targetIsPrevention)) {
      return;
    }

    if (currentUrl === '/home' && targetIsHome) {
      return;
    }

    if (isActing || isPrevention) {
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
              this.router.navigate([path]);
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.router.navigate([path]);
    }
  }
}

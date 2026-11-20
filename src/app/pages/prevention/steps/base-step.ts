import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import PreventionStepsStore from '@service/prevention-steps-store';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Directive()
export abstract class PreventionStep {
  protected store = inject(PreventionStepsStore);
  protected router = inject(Router);
  protected navCtrl = inject(NavController);
  protected t = injectT(i18n);

  abstract next(): void;

  back() {
    this.navCtrl.back();
  }
}

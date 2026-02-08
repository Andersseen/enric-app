import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import PreventionStepsStore from '@service/prevention-steps-store';

@Directive()
export abstract class PreventionStep {
  protected store = inject(PreventionStepsStore);
  protected router = inject(Router);
  protected navCtrl = inject(NavController);

  abstract next(): void;

  back() {
    this.navCtrl.back();
  }
}

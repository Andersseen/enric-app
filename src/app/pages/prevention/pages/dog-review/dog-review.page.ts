import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dog-review',
  imports: [IonRouterOutlet],
  template: ` <ion-router-outlet />`,
})
export default class DogReviewPage {}

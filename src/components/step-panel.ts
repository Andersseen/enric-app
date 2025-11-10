import { Component, input } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-step-panel',
  imports: [IonHeader, IonTitle, IonToolbar],
  template: `
    <section id="search-page">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ title() }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ng-content />
    </section>
  `,
})
export default class StepPanel {
  title = input<string>();
}

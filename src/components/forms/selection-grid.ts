import { Component, input, output } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selection-grid',
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <ion-grid>
      <ion-row class="justify-center">
        @for (item of items(); track item) {
        <ion-col [size]="colSize()" [sizeMd]="colSizeMd()" [sizeLg]="colSizeLg()" class="p-2">
          <ion-card
            class="ion-text-center h-full min-h-32 flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-95 hover:shadow-lg rounded-2xl border-2"
            [class.bg-primary]="selected() === item"
            [class.text-white]="selected() === item"
            [class.border-primary]="selected() === item"
            [class.bg-white]="selected() !== item"
            [class.border-transparent]="selected() !== item"
            [class.scale-105]="selected() === item"
            (click)="select.emit(item)"
          >
            <ion-card-content>
              <h2 class="text-2xl font-bold tracking-tight">{{ item }}</h2>
            </ion-card-content>
          </ion-card>
        </ion-col>
        }
      </ion-row>
    </ion-grid>
  `,
  styles: `
    :host {
      display: block;
    }
    .bg-primary-50 {
      background-color: var(--ion-color-primary-tint, #e0e7ff);
    }
    .border-primary {
      border-color: var(--ion-color-primary, #3b82f6);
    }
  `,
})
export default class SelectionGridComponent {
  items = input.required<any[]>();
  selected = input<any | null>(null);

  // Grid layout inputs with defaults
  colSize = input<string>('6');
  colSizeMd = input<string>('4');
  colSizeLg = input<string>('3');

  select = output<any>();
}

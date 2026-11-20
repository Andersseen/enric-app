import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';
import { OptionGroup, optionKey } from '@i18n/options';

@Component({
  selector: 'app-selection-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <ion-grid>
      <ion-row class="justify-center">
        @for (item of items(); track item) {
          <ion-col
            [size]="colSize()"
            [sizeMd]="colSizeMd()"
            [sizeLg]="colSizeLg()"
            [class.p-2]="!compact()"
            [class.p-1]="compact()"
          >
            <ion-card
              [class.min-h-32]="!compact()"
              [class.min-h-16]="compact()"
              [class.m-0]="compact()"
              class="ion-text-center h-full flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-95 hover:shadow-lg rounded-2xl border-2"
              [class.bg-primary]="selected() === item"
              [class.text-white]="selected() === item"
              [class.border-primary]="selected() === item"
              [class.bg-surface]="selected() !== item"
              [class.text-foreground]="selected() !== item"
              [class.border-border]="selected() !== item"
              [class.scale-105]="selected() === item"
              (click)="select.emit(item)"
            >
              <ion-card-content>
                <h2 class="text-2xl font-bold tracking-tight">{{ label(item) }}</h2>
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

  // Tarjetas más bajas, para listas largas (p. ej. números)
  compact = input(false, { transform: booleanAttribute });

  /** Grupo de opciones: se muestra el texto traducido, pero se emite el valor guardado. */
  group = input<OptionGroup | null>(null);

  select = output<any>();

  #t = injectT(i18n);

  label(item: unknown): string {
    const group = this.group();
    const key = group ? optionKey(group, item) : null;
    return key ? this.#t(key) : String(item);
  }
}

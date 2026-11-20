import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActuacionData } from '@service/excel.service';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';
import { OptionGroup, optionLabel } from '@i18n/options';

@Component({
  selector: 'app-actuacion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon],
  template: `
    @if (data.length === 0) {
      <div class="w-full border border-border rounded-lg px-4 py-6 text-center text-sm text-muted">
        {{ t('reports.empty') }}
      </div>
    } @else {
      <div class="overflow-x-auto w-full shrink-0 border border-border rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-muted">
          <thead class="text-xs text-foreground uppercase bg-surface">
            <tr>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.dateTime') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.weatherWorker') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.zone') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.species') }}</th>
              <th scope="col" class="px-3 py-2">{{ t('reports.table.count') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[120px]">{{ t('reports.table.behavior') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[120px]">{{ t('reports.table.type') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.operation') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[150px]">{{ t('reports.table.interaction') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.method') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[100px]">{{ t('reports.table.animal') }}</th>
              <th scope="col" class="px-3 py-2">{{ t('reports.table.efficacy') }}</th>
              <th scope="col" class="px-3 py-2">{{ t('reports.table.captured') }}</th>
              <th scope="col" class="px-3 py-2 min-w-[150px]">{{ t('reports.table.notes') }}</th>
              <th scope="col" class="px-3 py-2 text-center sticky right-0 bg-surface">{{ t('reports.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (row of data; track $index) {
              <tr class="bg-background border-b border-border hover:bg-surface">
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="font-medium text-foreground">{{ row.date || '-' }}</div>
                  <div class="text-xs text-muted">{{ row.time || '-' }}</div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="font-medium text-foreground">{{ opt('weather', row.weather) }}</div>
                  <div class="text-xs text-muted">{{ row.worker || '-' }}</div>
                </td>
                <td class="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                  {{ row.zoneId }}
                </td>
                <td class="px-3 py-2">{{ row.speciesId }}</td>
                <td class="px-3 py-2">{{ row.count }}</td>
                <td class="px-3 py-2">{{ opt('behavior', row.behavior) }}</td>
                <td class="px-3 py-2">{{ opt('actionType', row.actionType) }}</td>
                <td class="px-3 py-2">{{ opt('yesNo', row.operation) }}</td>
                <td class="px-3 py-2">{{ opt('yesNo', row.interaction) }}</td>
                <td class="px-3 py-2">{{ opt('method', row.method) }}</td>
                <td class="px-3 py-2">{{ row.animal }}</td>
                <td class="px-3 py-2">{{ opt('yesNo', row.efficacy) }}</td>
                <td class="px-3 py-2">{{ row.captured }}</td>
                <td class="px-3 py-2 truncate max-w-[150px]" title="{{ row.notes }}">
                  {{ row.notes }}
                </td>
                <td
                  class="px-3 py-2 text-center sticky right-0 bg-background shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)]"
                >
                  <ion-button fill="clear" color="danger" size="small" (click)="onRemove($index)">
                    <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: `
    /* Ionic pone padding: 0 en th/td y gana a las clases de Tailwind */
    th,
    td {
      padding: 0.5rem 0.75rem;
    }
  `,
})
export default class ActuacionTableComponent {
  protected t = injectT(i18n);

  /** Texto traducido de un valor guardado ("-" si está vacío). */
  protected opt(group: OptionGroup, value: unknown): string {
    return optionLabel(this.t, group, value);
  }
  @Input() data: ActuacionData[] = [];
  @Output() remove = new EventEmitter<number>();

  constructor() {
    addIcons({ trashOutline });
  }

  onRemove(index: number) {
    this.remove.emit(index);
  }
}

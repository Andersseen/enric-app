import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActuacionData } from '@service/excel.service';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-actuacion-table',
  imports: [IonButton, IonIcon],
  template: `
    <div class="overflow-x-auto w-full border border-gray-200 rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Fecha/Hora</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Clima/Personal</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Zona</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Especie</th>
            <th scope="col" class="px-3 py-2">Nº</th>
            <th scope="col" class="px-3 py-2 min-w-[120px]">Comportamiento</th>
            <th scope="col" class="px-3 py-2 min-w-[120px]">Tipo</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Operación</th>
            <th scope="col" class="px-3 py-2 min-w-[150px]">Interacción</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Método</th>
            <th scope="col" class="px-3 py-2 min-w-[100px]">Animal</th>
            <th scope="col" class="px-3 py-2">Eficacia</th>
            <th scope="col" class="px-3 py-2">Capt.</th>
            <th scope="col" class="px-3 py-2 min-w-[150px]">Obs.</th>
            <th scope="col" class="px-3 py-2 text-center sticky right-0 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (row of data; track $index) {
            <tr class="bg-white border-b hover:bg-gray-50">
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ row.date || '-' }}</div>
                <div class="text-xs text-gray-500">{{ row.time || '-' }}</div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ row.weather || '-' }}</div>
                <div class="text-xs text-gray-500">{{ row.worker || '-' }}</div>
              </td>
              <td class="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                {{ row.zoneId }}
              </td>
              <td class="px-3 py-2">{{ row.speciesId }}</td>
              <td class="px-3 py-2">{{ row.count }}</td>
              <td class="px-3 py-2">{{ row.behavior }}</td>
              <td class="px-3 py-2">{{ row.actionType }}</td>
              <td class="px-3 py-2">{{ row.operation }}</td>
              <td class="px-3 py-2">{{ row.interaction }}</td>
              <td class="px-3 py-2">{{ row.method }}</td>
              <td class="px-3 py-2">{{ row.animal }}</td>
              <td class="px-3 py-2">{{ row.efficacy }}</td>
              <td class="px-3 py-2">{{ row.captured }}</td>
              <td class="px-3 py-2 truncate max-w-[150px]" title="{{ row.notes }}">
                {{ row.notes }}
              </td>
              <td
                class="px-3 py-2 text-center sticky right-0 bg-white shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)]"
              >
                <ion-button fill="clear" color="danger" size="small" (click)="onRemove($index)">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="15" class="px-3 py-4 text-center text-gray-500">
                No hay datos. Añade una actuación o importa un Excel.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export default class ActuacionTableComponent {
  @Input() data: ActuacionData[] = [];
  @Output() remove = new EventEmitter<number>();

  constructor() {
    addIcons({ trashOutline });
  }

  onRemove(index: number) {
    this.remove.emit(index);
  }
}

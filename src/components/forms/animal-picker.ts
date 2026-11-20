import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonInput } from '@ionic/angular/standalone';
import AnimalsStore, { AnimalKind } from '@service/animals-store';
import SelectionGridComponent from './selection-grid';

/**
 * Selector de "Animal empleado": muestra los halcones y/o perros guardados
 * en "Gestionar animales" y permite escribir otro nombre si no está en la lista.
 */
@Component({
  selector: 'app-animal-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectionGridComponent, IonInput, RouterLink],
  template: `
    @if (names().length > 0) {
      <app-selection-grid
        compact
        colSize="6"
        colSizeMd="4"
        colSizeLg="3"
        [items]="names()"
        [selected]="value()"
        (select)="valueChange.emit($event)"
      />
    } @else {
      <p class="px-4 pt-4 text-sm text-muted">
        No hay {{ emptyLabel() }} guardados.
        <a routerLink="/home/manage-animals" class="text-primary underline">Añadirlos</a>
      </p>
    }

    <div class="px-4 py-3">
      <ion-input
        fill="outline"
        labelPlacement="floating"
        [label]="names().length > 0 ? 'Otro (escribir nombre)' : 'Nombre del animal'"
        [value]="isCustom() ? value() : ''"
        (ionInput)="valueChange.emit($any($event.target).value ?? '')"
      ></ion-input>
    </div>
  `,
})
export default class AnimalPickerComponent {
  #animals = inject(AnimalsStore);

  /** Qué animales mostrar; si no se indica, se muestran halcones y perros. */
  kind = input<AnimalKind | null>(null);
  value = input<string | null>(null);
  valueChange = output<string>();

  names = computed(() => {
    const kind = this.kind();
    if (kind === 'falcon') return this.#animals.falcons();
    if (kind === 'dog') return this.#animals.dogs();
    return [...this.#animals.falcons(), ...this.#animals.dogs()];
  });

  isCustom = computed(() => {
    const v = this.value();
    return !!v && !this.names().includes(v);
  });

  emptyLabel = computed(() => {
    const kind = this.kind();
    if (kind === 'falcon') return 'halcones';
    if (kind === 'dog') return 'perros';
    return 'animales';
  });
}

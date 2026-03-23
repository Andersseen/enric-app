import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { ScfSectionData } from '@service/global-excel.service';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-scf-section-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <div class="rounded-lg border border-border bg-background overflow-hidden">
      <!-- Section header -->
      <div
        class="px-3 py-2 bg-surface border-b border-border
                  flex items-center justify-between gap-2"
      >
        <p class="font-semibold text-sm text-foreground">{{ section.title }}</p>
        <div class="flex items-center gap-3 text-xs text-muted">
          <span>{{ section.headers.length }} col.</span>
          <span class="font-medium" [class.text-green-600]="section.rows.length > 0">
            {{ section.rows.length > 0 ? section.rows.length + ' filas' : 'Sin datos' }}
          </span>
          <!-- Edit table button -->
          <button
            type="button"
            class="flex items-center gap-1 text-primary font-semibold
                     py-1 px-2 rounded hover:bg-primary/10 active:bg-primary/20
                     transition-colors"
            (click)="editRequested.emit()"
          >
            <ion-icon name="create-outline" class="text-base" />
            Editar
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto max-h-96">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr class="bg-surface">
              <th
                class="border-b border-r border-border px-2 py-1.5 text-left
                         font-semibold text-muted text-xs w-8"
              >
                #
              </th>
              @for (header of section.headers; track header) {
                <th
                  class="border-b border-r border-border px-3 py-2 text-left
                         font-semibold text-foreground whitespace-nowrap text-xs"
                >
                  {{ header }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of visibleRows(); track $index) {
              <tr
                class="transition-colors"
                [class.bg-background]="$index % 2 === 0"
                [class.bg-surface]="$index % 2 !== 0"
                [class.opacity-40]="$index >= section.rows.length"
              >
                <td
                  class="border-b border-r border-border px-2 py-1.5
                           text-muted text-xs text-center"
                >
                  {{ $index + 1 }}
                </td>
                @for (cell of row; track $index) {
                  <td
                    class="border-b border-r border-border px-3 py-1.5
                           text-foreground whitespace-nowrap text-xs"
                  >
                    {{ cell || '—' }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div
        class="px-3 py-1.5 border-t border-border bg-surface
                  flex items-center justify-between gap-2"
      >
        @if (section.rows.length > 10) {
          <span class="text-xs text-muted">{{ section.rows.length }} filas</span>
        } @else {
          <span></span>
        }
        <button
          type="button"
          class="text-xs font-semibold text-primary flex items-center gap-1 py-1 px-2
                   rounded hover:bg-primary/10 active:bg-primary/20 transition-colors"
          (click)="addRowRequested.emit()"
        >
          + Añadir fila
        </button>
      </div>
    </div>
  `,
})
export class ScfSectionTableComponent {
  @Input({ required: true }) section!: ScfSectionData;

  /** Fired when the user taps the ✏️ Editar button in the header */
  @Output() editRequested = new EventEmitter<void>();
  @Output() addRowRequested = new EventEmitter<void>();

  constructor() {
    addIcons({ createOutline });
  }

  visibleRows(): string[][] {
    if (this.section.rows.length > 0) return this.section.rows;
    return Array.from({ length: Math.min(this.section.emptyRows, 4) }, () =>
      Array(this.section.headers.length).fill(''),
    );
  }
}

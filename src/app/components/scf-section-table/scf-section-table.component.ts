import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScfSectionData } from '@service/global-excel.service';

@Component({
  selector: 'app-scf-section-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
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

      <!-- Footer row count -->
      @if (section.rows.length > 10) {
        <div
          class="px-3 py-1.5 border-t border-border bg-surface text-xs text-muted text-right"
        >
          Mostrando {{ section.rows.length }} filas
        </div>
      }
    </div>
  `,
})
export class ScfSectionTableComponent {
  @Input({ required: true }) section!: ScfSectionData;

  visibleRows(): string[][] {
    if (this.section.rows.length > 0) return this.section.rows;
    return Array.from({ length: Math.min(this.section.emptyRows, 4) }, () =>
      Array(this.section.headers.length).fill(''),
    );
  }
}

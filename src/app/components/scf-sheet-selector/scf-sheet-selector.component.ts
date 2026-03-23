import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ScfSheetData } from '@service/global-excel.service';

@Component({
  selector: 'app-scf-sheet-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="bg-surface border border-border rounded-xl p-2">
      <div
        role="radiogroup"
        aria-label="Hojas SCF"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
      >
        @for (sheet of sheets; track sheet.id) {
          <button
            type="button"
            role="radio"
            [attr.aria-checked]="selectedSheetId === sheet.id"
            class="w-full text-left rounded-lg border px-3 py-2.5 transition-colors"
            [class.border-primary]="selectedSheetId === sheet.id"
            [class.bg-background]="selectedSheetId === sheet.id"
            [class.border-border]="selectedSheetId !== sheet.id"
            [class.bg-surface]="selectedSheetId !== sheet.id"
            (click)="sheetSelected.emit(sheet.id)"
          >
            <div class="flex items-start gap-2">
              <span
                class="mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-colors"
                [class.border-primary]="selectedSheetId === sheet.id"
                [class.bg-primary]="selectedSheetId === sheet.id"
                [class.border-muted]="selectedSheetId !== sheet.id"
              ></span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-foreground leading-5">
                  {{ sheetLabel(sheet.id) }}
                </p>
                <p class="text-xs text-muted leading-4 truncate">{{ sheet.title }}</p>
                <p class="text-xs text-muted leading-4">
                  {{ sheetRowCount(sheet) }} fila{{ sheetRowCount(sheet) !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </button>
        }
      </div>
    </div>
  `,
})
export class ScfSheetSelectorComponent {
  @Input() sheets: ScfSheetData[] = [];
  @Input() selectedSheetId = '';

  @Output() sheetSelected = new EventEmitter<string>();

  sheetLabel(sheetId: string): string {
    return sheetId.replace(/_/g, ' ');
  }

  sheetRowCount(sheet: ScfSheetData): number {
    return sheet.sections.reduce((acc, s) => acc + s.rows.length, 0);
  }
}

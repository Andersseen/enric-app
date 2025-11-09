import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',

  template: `
    <div
      class="mb-4 flex items-center justify-between gap-4 sticky top-0 z-10 bg-background w-full"
    >
      <div class="flex-1">
        <label for="search" class="sr-only">Buscar</label>
        <input
          id="search"
          type="text"
          placeholder="Buscar pájaro (nombre común o científico)..."
          [value]="value()"
          (input)="onSearch($event)"
          class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          aria-label="Buscar especies"
        />
      </div>
    </div>
  `,
})
export default class SearchBar {
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  onSearch(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.valueChange.emit(v);
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-searchbar',

  template: `
    <div class="flex items-center gap-3 w-full">
      <label for="sb-search" class="sr-only">Buscar</label>
      <input
        id="sb-search"
        type="text"
        class="w-full rounded-lg border px-3 py-2 text-sm"
        [value]="value()"
        (input)="onInput($event)"
        placeholder="Buscar pájaro (nombre común o científico)..."
        aria-label="Buscar especies"
      />
    </div>
  `,
})
export default class SearchBarComponent {
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.valueChange.emit(v);
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <div
      class="mb-4 flex items-center justify-between gap-4 sticky top-0 z-10 bg-background w-full"
    >
      <div class="flex-1">
        <label for="search" class="sr-only">{{ t('birds.searchLabel') }}</label>
        <input
          id="search"
          type="text"
          [placeholder]="t('birds.searchPlaceholder')"
          [value]="value()"
          (input)="onSearch($event)"
          class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          [attr.aria-label]="t('birds.searchLabel')"
        />
      </div>
    </div>
  `,
})
export default class SearchBar {
  protected t = injectT(i18n);
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  onSearch(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.valueChange.emit(v);
  }
}

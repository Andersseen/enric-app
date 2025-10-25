import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonRippleEffect } from '@ionic/angular/standalone';

type CardColor = 'primary' | 'secondary';

export interface ActionCardItem {
  icon: string;
  title: string;
  description: string;
  routerLink: string | any[];
  color?: CardColor;
}

@Component({
  selector: 'app-action-cards',
  imports: [IonRippleEffect, RouterLink],
  template: `
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      @for (card of items(); track card.title) {
      <a
        [routerLink]="card.routerLink"
        [class]="getBtnClass(card)"
        (focus)="focused.set(card.title)"
        (blur)="focused.set(null)"
      >
        <div class="flex items-center gap-4">
          <div [class]="getIconClass(card)" aria-hidden="true">
            <span class="text-xl">{{ card.icon }}</span>
          </div>

          <div class="min-w-0">
            <h2 class="truncate text-base font-medium">{{ card.title }}</h2>
            <p class="mt-1 line-clamp-2 text-sm text-muted">
              {{ card.description }}
            </p>
          </div>
        </div>
        <ion-ripple-effect class="pointer-events-none absolute inset-0" />
      </a>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export default class ActionCards {
  items = input.required<ActionCardItem[]>();

  focused = signal<string | null>(null);

  readonly baseBtnClass =
    'relative group overflow-hidden rounded-xl border border-muted bg-surface p-4 text-left shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.99]';

  readonly iconBaseClass = 'flex h-12 w-12 items-center justify-center rounded-lg';

  getBtnClass(card: ActionCardItem): string {
    return this.focused() === card.title
      ? `${this.baseBtnClass} focus-visible:ring-2`
      : this.baseBtnClass;
  }

  getIconClass(card: ActionCardItem): string {
    const color = card.color ?? 'primary';
    const colorClass =
      color === 'secondary' ? ' bg-secondary text-on-secondary' : ' bg-primary text-on-primary';
    return `${this.iconBaseClass} ${colorClass}`;
  }
}

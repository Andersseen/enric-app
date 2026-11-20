import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import ActionCards, { type ActionCardItem } from '@components/action-cards';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-prevention-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionCards],
  template: `
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left">
        {{ t('prevention.title') }}
      </h2>
      <app-action-cards [items]="cards()" />
    </div>
  `,
  host: { class: 'flex flex-col h-full w-full' },
})
export default class PreventionListPage {
  protected t = injectT(i18n);
  cards = computed<ActionCardItem[]>(() => [
    {
      icon: '🛣️',
      title: this.t('prevention.cards.trackReview.title'),
      description: this.t('prevention.cards.trackReview.description'),
      routerLink: ['track-review'],
      color: 'secondary',
    },
    {
      icon: '🧱',
      title: this.t('prevention.cards.perimeterReview.title'),
      description: this.t('prevention.cards.perimeterReview.description'),
      routerLink: ['perimeter-review'],
      color: 'primary',
    },
    {
      icon: '🐕',
      title: this.t('prevention.cards.dogReview.title'),
      description: this.t('prevention.cards.dogReview.description'),
      routerLink: ['dog-review'],
      color: 'secondary',
    },
    {
      icon: '🦅',
      title: this.t('prevention.cards.markingFlight.title'),
      description: this.t('prevention.cards.markingFlight.description'),
      routerLink: ['marking-flight'],
      color: 'primary',
    },
    {
      icon: '📝',
      title: this.t('prevention.cards.ppoam.title'),
      description: this.t('prevention.cards.ppoam.description'),
      routerLink: ['ppoam'],
      color: 'primary',
    },
  ]);
}

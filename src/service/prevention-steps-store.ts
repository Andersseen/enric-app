import { computed, Injectable, signal } from '@angular/core';
import { Zone } from '@data/zones';

export type PreventionFlowType =
  | 'track-review'
  | 'perimeter-review'
  | 'dog-review'
  | 'marking-flight';

@Injectable({ providedIn: 'root' })
export default class PreventionStepsStore {
  // State for different flows
  trackReviewObservation = signal<string>('');
  perimeterReviewObservation = signal<string>('No se observan daños en el vallado perimetral.');

  dogReviewZone = signal<Zone | null>(null);
  dogReviewAnimal = signal<string>('');
  dogReviewNotes = signal<string>('');

  flightReviewZone = signal<Zone | null>(null);
  flightReviewMethod = signal<string>('');
  flightReviewAnimal = signal<string>('');
  flightReviewNotes = signal<string>('');

  // Reset state
  reset() {
    this.trackReviewObservation.set('');
    this.perimeterReviewObservation.set('No se observan daños en el vallado perimetral.');
    this.dogReviewZone.set(null);
    this.dogReviewAnimal.set('');
    this.dogReviewNotes.set('');
    this.flightReviewZone.set(null);
    this.flightReviewMethod.set('');
    this.flightReviewAnimal.set('');
    this.flightReviewNotes.set('');
  }
}

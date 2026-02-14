import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const STORE_KEY = 'enric_favorite_birds';

@Injectable({
  providedIn: 'root',
})
export class BirdStore {
  // Signal to hold the list of favorite bird IDs
  #favorites = signal<number[]>([]);

  // Public read-only access
  favorites = this.#favorites.asReadonly();

  constructor() {
    this.loadFavorites();
  }

  /**
   * Load favorites from Preferences
   */
  private async loadFavorites() {
    const { value } = await Preferences.get({ key: STORE_KEY });
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          this.#favorites.set(parsed);
        }
      } catch (e) {
        console.error('Error parsing favorite birds', e);
      }
    }
  }

  /**
   * Toggle favorite status for a bird ID
   */
  async toggleFavorite(id: number) {
    const current = this.#favorites();
    const isFav = current.includes(id);

    let updated: number[];
    if (isFav) {
      updated = current.filter((favId) => favId !== id);
    } else {
      updated = [...current, id];
    }

    this.#favorites.set(updated);
    await this.saveToStorage(updated);
  }

  /**
   * Check if a bird is a favorite
   */
  isFavorite(id: number) {
    return this.favorites().includes(id);
  }

  /**
   * Save to Preferences
   */
  private async saveToStorage(ids: number[]) {
    await Preferences.set({
      key: STORE_KEY,
      value: JSON.stringify(ids),
    });
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type AnimalKind = 'falcon' | 'dog';

interface AnimalsData {
  falcons: string[];
  dogs: string[];
}

const ANIMALS_STORAGE_KEY = 'animals';

/**
 * Animales de servicio (halcones y perros) que se pueden elegir en los pasos
 * de "Animal empleado". Se gestionan desde la pantalla "Gestionar animales".
 */
@Injectable({ providedIn: 'root' })
export default class AnimalsStore {
  #data = signal<AnimalsData>({ falcons: [], dogs: [] });

  falcons = computed(() => this.#data().falcons);
  dogs = computed(() => this.#data().dogs);

  constructor() {
    this.load();
  }

  list(kind: AnimalKind): string[] {
    return kind === 'falcon' ? this.falcons() : this.dogs();
  }

  add(kind: AnimalKind, name: string): boolean {
    const clean = name.trim();
    if (!clean) return false;
    const key = this.#key(kind);
    const current = this.#data()[key];
    if (current.some((n) => n.toLowerCase() === clean.toLowerCase())) return false;
    this.#update({ ...this.#data(), [key]: [...current, clean] });
    return true;
  }

  remove(kind: AnimalKind, name: string): void {
    const key = this.#key(kind);
    this.#update({ ...this.#data(), [key]: this.#data()[key].filter((n) => n !== name) });
  }

  #key(kind: AnimalKind): keyof AnimalsData {
    return kind === 'falcon' ? 'falcons' : 'dogs';
  }

  #update(data: AnimalsData): void {
    this.#data.set(data);
    Preferences.set({ key: ANIMALS_STORAGE_KEY, value: JSON.stringify(data) });
  }

  private async load(): Promise<void> {
    const { value } = await Preferences.get({ key: ANIMALS_STORAGE_KEY });
    if (!value) return;
    try {
      const parsed = JSON.parse(value) as Partial<AnimalsData>;
      this.#data.set({
        falcons: Array.isArray(parsed.falcons) ? parsed.falcons : [],
        dogs: Array.isArray(parsed.dogs) ? parsed.dogs : [],
      });
    } catch (e) {
      console.error('Error loading animals', e);
    }
  }
}

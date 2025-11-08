import { Component, EventEmitter, Output, signal, Input as InputFn } from '@angular/core';
import { CommonModule } from '@angular/common';
import AppHeader from '@components/header';
import { IonButton, IonContent, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-comments',
  imports: [IonContent, IonTextarea, IonButton, AppHeader],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <app-header [title]="title" [subtitle]="subtitle" [showBackButton]="true"></app-header>

      <div class="p-4">
        <ion-textarea
          [label]="label"
          labelPlacement="floating"
          fill="solid"
          placeholder="comentario"
        ></ion-textarea>

        <div class="mt-8 flex justify-end">
          <ion-button>Seguir</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class Comments {
  title = 'Observaciones';
  subtitle: string | null = null;
  label = 'Escribe tu comentario';

  private _text = signal<string>('');
  text = this._text.asReadonly();

  onTextChange(value: string): void {
    this._text.set(value);
  }
}

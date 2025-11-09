import { Component } from '@angular/core';
import AppHeader from '@components/header';
import MapZones from '@components/map-zones';

@Component({
  selector: 'app-prevention',
  imports: [AppHeader, MapZones],
  template: `
    <app-header title="Prevención" [showBackButton]="true" />
    <app-map-zones />
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class PreventionPage {}

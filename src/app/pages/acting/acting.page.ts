import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import MapZones from '@components/map-zones';
import FilterBirds from '@components/filter-birds';

@Component({
  selector: 'app-acting',
  imports: [MatButtonModule, MatStepperModule, MapZones, FilterBirds],
  template: `
    <mat-stepper>
      <mat-step>
        <ng-template matStepLabel>Step 1</ng-template>
        <ng-template matStepContent>
          <app-map-zones />
          <button matButton matStepperNext>Next</button>
        </ng-template>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Step 2</ng-template>
        <ng-template matStepContent>
          <app-filter-birds />
          <button matButton matStepperPrevious>Back</button>
          <button matButton matStepperNext>Next</button>
        </ng-template>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Step 3</ng-template>
        <p>This content was rendered eagerly</p>
        <button matButton matStepperPrevious>Back</button>
      </mat-step>
    </mat-stepper>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ActingPage {}

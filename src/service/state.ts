import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BirdItem } from '@data/bird';
import { STATE, STEP_ID } from '@data/state';
import { StepId, STEP_STATE, STEPS } from '@data/steps';
import { Zone } from '@data/zones';

@Injectable({ providedIn: 'root' })
export default class StoreService {
  #router = inject(Router);
  #steps = signal(STEPS);

  steps = this.#steps.asReadonly();
  state = signal(STATE);

  currentStep = signal<StepId>(STEPS[0].id);

  currentStateStep = computed(() => STEP_STATE[this.currentStep()]);
  currentLabel = computed(() => this.state()[this.currentStep()].label);
  currentValue = computed(() => this.state()[this.currentStep()].value);

  finishStep = computed(() => !!this.state()[this.currentStep()].value);

  step1Value = computed(() => this.state()[STEP_ID.Step1].value as Zone);
  step2Value = computed(() => this.state()[STEP_ID.Step2].value as BirdItem);
  step3Value = computed(() => this.state()[STEP_ID.Step3].value);
  step4Value = computed(() => this.state()[STEP_ID.Step4].value);
  step5Value = computed(() => this.state()[STEP_ID.Step5].value);

  constructor() {
    const step = this.#router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step as StepId);
    }
  }

  setCurrentStep(stepId: StepId) {
    this.currentStep.set(stepId);
  }

  setValueForCurrentStep(value: unknown) {
    this.state.update((currentState) => ({
      ...currentState,
      [this.currentStep()]: { label: currentState[this.currentStep()].label, value },
    }));
  }
}

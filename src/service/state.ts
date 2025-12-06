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
  state = signal(JSON.parse(JSON.stringify(STATE)));

  currentStep = signal<StepId>(STEPS[0].id);

  currentStateStep = computed(() => STEP_STATE[this.currentStep()]);
  currentLabel = computed(() => this.state()[this.currentStep()].label);
  currentValue = computed(() => this.state()[this.currentStep()].value);

  finishStep = computed(() => !!this.state()[this.currentStep()].value);

  step1Value = computed(() => this.state()[STEP_ID.Step1].value as Zone | null);
  step2Value = computed(() => this.state()[STEP_ID.Step2].value as BirdItem | null);
  step3Value = computed(() => this.state()[STEP_ID.Step3].value);
  step4Value = computed(() => this.state()[STEP_ID.Step4].value);
  step5Value = computed(() => this.state()[STEP_ID.Step5].value);
  step6Value = computed(() => this.state()[STEP_ID.Step6].value);
  step7Value = computed(() => this.state()[STEP_ID.Step7].value);
  step8Value = computed(() => this.state()[STEP_ID.Step8].value);
  step9Value = computed(() => this.state()[STEP_ID.Step9].value);
  step10Value = computed(() => this.state()[STEP_ID.Step10].value);
  step11Value = computed(() => this.state()[STEP_ID.Step11].value);
  step12Value = computed(() => this.state()[STEP_ID.Step12].value);

  constructor() {
    const step = this.#router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step as StepId);
    }
  }

  setCurrentStep(stepId: StepId) {
    this.currentStep.set(stepId);
  }

  goToNextStep() {
    const nextStep = STEP_STATE[this.currentStep()].next;
    if (nextStep) {
      const basePath = this.#router.url.includes('traps') ? 'traps' : 'action';
      this.#router.navigate(['home', basePath, nextStep]);
      this.currentStep.set(nextStep);
    }
  }

  setValueForCurrentStep(value: unknown) {
    this.state.update((currentState) => ({
      ...currentState,
      [this.currentStep()]: { label: currentState[this.currentStep()].label, value },
    }));
  }

  reset() {
    this.state.set(JSON.parse(JSON.stringify(STATE)));
    this.currentStep.set(STEPS[0].id);
    this.#router.navigate(['/']);
  }
}

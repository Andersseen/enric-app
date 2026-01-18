import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DOG_REVIEW_STATE,
  DOG_REVIEW_STEP_ID,
  DOG_REVIEW_STEP_STATE,
  DOG_REVIEW_STEPS,
  DogReviewStepId,
} from '@data/dog-review-data';
import { Zone } from '@data/zones';

@Injectable({ providedIn: 'root' })
export default class PreventionStore {
  protected router = inject(Router);

  state = signal(JSON.parse(JSON.stringify(DOG_REVIEW_STATE)));

  #steps = signal(DOG_REVIEW_STEPS);

  steps = this.#steps.asReadonly();

  currentStep = signal<DogReviewStepId>(this.steps()[0].id);

  currentStateStep = computed(() => DOG_REVIEW_STEP_STATE[this.currentStep()]);
  currentLabel = computed(() => this.state()[this.currentStep()].label);
  currentValue = computed(() => this.state()[this.currentStep()].value);

  finishStep = computed(() => {
    if (this.acceptEmptyStep([DOG_REVIEW_STEP_ID.Step2, DOG_REVIEW_STEP_ID.Step3])) {
      return true;
    }
    return !!this.state()[this.currentStep()].value;
  });

  step1Value = computed(() => this.state()[DOG_REVIEW_STEP_ID.Step1].value as Zone);
  step2Value = computed(() => this.state()[DOG_REVIEW_STEP_ID.Step2].value);
  step3Value = computed(() => this.state()[DOG_REVIEW_STEP_ID.Step3].value);

  constructor() {
    const step = this.router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step as DogReviewStepId);
    }
  }

  setCurrentStep(stepId: DogReviewStepId) {
    this.currentStep.set(stepId);
  }

  goToNextStep() {
    const nextStep = DOG_REVIEW_STEP_STATE[this.currentStep()].next;

    if (nextStep) {
      const basePath = this.router.url.includes('prevention') ? 'prevention' : 'traps';
      this.router.navigate(['home', basePath, nextStep]);
      this.currentStep.set(nextStep);
    }
  }

  setValueForCurrentStep(value: unknown) {
    this.state.update((currentState) => {
      return {
        ...currentState,
        [this.currentStep()]: { label: currentState[this.currentStep()].label, value },
      };
    });
  }

  acceptEmptyStep(stepId: DogReviewStepId[]): boolean {
    if (stepId.includes(this.currentStep())) {
      return true;
    }
    return false;
  }
}

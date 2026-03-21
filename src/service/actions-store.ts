import { computed, Injectable, signal } from '@angular/core';
import { ACTIONS_STEPS } from '@data/actions-data';
import { BirdItem } from '@data/bird';
import { STEP_ID } from '@data/state';
import { STEP_STATE, StepId } from '@data/steps';
import { Zone } from '@data/zones';
import BaseStore from './base-store';

@Injectable({ providedIn: 'root' })
export default class ActionsStore extends BaseStore {
  #steps = signal(ACTIONS_STEPS);

  override steps = this.#steps.asReadonly();

  #methodUsesAnimal(method: string | null | undefined): boolean {
    return method === 'Perro' || method === 'Vuelo dispersión halcón';
  }

  currentStateStep = computed(() => {
    const state = { ...STEP_STATE[this.currentStep()] };
    const method = this.step8Value() as string;

    // Skip step-9 (Animal) if method does not use an animal.
    if (this.currentStep() === STEP_ID.Step8 && !this.#methodUsesAnimal(method)) {
      state.next = STEP_ID.Step10;
    }
    if (this.currentStep() === STEP_ID.Step10 && !this.#methodUsesAnimal(method)) {
      state.prev = STEP_ID.Step8;
    }

    // Skip step-11 (Captura) if method is not 'Vuelo dispersión halcón'.
    if (this.currentStep() === STEP_ID.Step10 && method !== 'Vuelo dispersión halcón') {
      state.next = STEP_ID.Step12;
    }
    if (this.currentStep() === STEP_ID.Step12 && method !== 'Vuelo dispersión halcón') {
      state.prev = STEP_ID.Step10;
    }
    return state;
  });
  currentLabel = computed(() => this.state()[this.currentStep()].label);
  currentValue = computed(() => this.state()[this.currentStep()].value);

  finishStep = computed(() => {
    if (this.acceptEmptyStep([STEP_ID.Step12])) {
      return true;
    }
    const value = this.state()[this.currentStep()].value;
    return value !== null && value !== undefined && value !== '';
  });

  step1Value = computed(() => this.state()[STEP_ID.Step1].value as Zone | null);
  step2Value = computed(() => this.state()[STEP_ID.Step2].value as BirdItem | null);
  step3Value = computed(() => this.state()[STEP_ID.Step3].value);
  step4Value = computed(() => this.state()[STEP_ID.Step4].value);
  step5Value = computed(() => this.state()[STEP_ID.Step5].value);
  step6Value = computed(() => this.state()[STEP_ID.Step6].value);
  step7Value = computed(() => this.state()[STEP_ID.Step7]?.value); // Operación
  step8Value = computed(() => this.state()[STEP_ID.Step8]?.value); // Método
  step9Value = computed(() => this.state()[STEP_ID.Step9]?.value); // Animal
  step10Value = computed(() => this.state()[STEP_ID.Step10]?.value); // Eficacia
  step11Value = computed(() => this.state()[STEP_ID.Step11]?.value); // Captura
  step12Value = computed(() => this.state()[STEP_ID.Step12]?.value); // Observaciones
  step13Value = computed(() => this.state()[STEP_ID.Step13]?.value); // Resumen

  constructor() {
    super();
    const step = this.router.url.split('/').pop();
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
      const basePath = this.router.url.includes('action') ? 'action' : 'traps';
      this.router.navigate(['home', basePath, nextStep]);
      this.currentStep.set(nextStep);
    }
  }

  setValueForCurrentStep(value: unknown) {
    this.state.update((currentState) => {
      const updatedState = {
        ...currentState,
        [this.currentStep()]: { label: currentState[this.currentStep()].label, value },
      };

      if (this.currentStep() === STEP_ID.Step8) {
        const method = (value as string | null | undefined) ?? '';

        if (!this.#methodUsesAnimal(method)) {
          updatedState[STEP_ID.Step9] = {
            label: currentState[STEP_ID.Step9].label,
            value: null,
          };
        }

        if (method !== 'Vuelo dispersión halcón') {
          updatedState[STEP_ID.Step11] = {
            label: currentState[STEP_ID.Step11].label,
            value: null,
          };
        }
      }

      return updatedState;
    });
  }
}

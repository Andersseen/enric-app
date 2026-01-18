export type DogReviewStepId = 'step-1' | 'step-2' | 'step-3' | 'step-4';

export interface DogReviewStep {
  id: DogReviewStepId;
  title: string;
  icon: string;
}

export type State = {
  [key in DogReviewStepId]: StateItem;
};

export interface StateItem {
  label: string;
  value: unknown | null;
}

export enum DOG_REVIEW_STEP_ID {
  Step1 = 'step-1',
  Step2 = 'step-2',
  Step3 = 'step-3',
  Step4 = 'step-4',
}

export const DOG_REVIEW_STEPS: DogReviewStep[] = [
  { id: 'step-1', title: 'Zonas', icon: 'map' },
  { id: 'step-2', title: 'Animal', icon: 'paw' },
  { id: 'step-3', title: 'Observaciones', icon: 'document-text' },
  { id: 'step-4', title: 'Resumen', icon: 'list' },
];

export const DOG_REVIEW_STATE: State = {
  [DOG_REVIEW_STEP_ID.Step1]: { label: 'Zona', value: null },
  [DOG_REVIEW_STEP_ID.Step2]: { label: 'Animal empleado', value: null },
  [DOG_REVIEW_STEP_ID.Step3]: { label: 'Observaciones', value: null },
  [DOG_REVIEW_STEP_ID.Step4]: { label: 'Resumen', value: null },
};

export const DOG_REVIEW_STEP_STATE = {
  'step-1': { prev: null, next: 'step-2' },
  'step-2': { prev: 'step-1', next: 'step-3' },
  'step-3': { prev: 'step-2', next: 'step-4' },
  'step-4': { prev: 'step-3', next: null },
} as const;

export interface Step {
  id: STEP_ID;
  title: string;
  icon: string;
}

export type STEP_ID = 'step-1' | 'step-2' | 'step-3' | 'step-4';

export const STEP_STATE = {
  'step-1': { prev: null, next: 'step-2' },
  'step-2': { prev: 'step-1', next: 'step-3' },
  'step-3': { prev: 'step-2', next: 'step-4' },
  'step-4': { prev: 'step-3', next: null },
} as const;

export const STEPS: Step[] = [
  { id: 'step-1', title: 'Zonas', icon: 'play-circle' },
  { id: 'step-2', title: 'Especies', icon: 'play-circle' },
  { id: 'step-3', title: 'Cantidades', icon: 'play-circle' },
  { id: 'step-4', title: 'Revisión', icon: 'play-circle' },
];

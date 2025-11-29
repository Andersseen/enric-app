export interface Step {
  id: StepId;
  title: string;
  icon: string;
}

export type StepId = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6' | 'step-7' | 'step-8' 

export const STEP_STATE = {
  'step-1': { prev: null, next: 'step-2' },
  'step-2': { prev: 'step-1', next: 'step-3' },
  'step-3': { prev: 'step-2', next: 'step-4' },
  'step-4': { prev: 'step-3', next: 'step-5' },
  'step-5': { prev: 'step-4', next: 'step-6' },
  'step-6': { prev: 'step-5', next: 'step-7' },
  'step-7': { prev: 'step-6', next: 'step-8' },
  'step-8': { prev: 'step-7', next: null },
} as const;

export const STEPS: Step[] = [
  { id: 'step-1', title: 'Zonas', icon: 'play-circle' },
  { id: 'step-2', title: 'Especies', icon: 'play-circle' },
  { id: 'step-3', title: 'Cantidades', icon: 'play-circle' },
  { id: 'step-4', title: 'Revisión', icon: 'play-circle' },
  { id: 'step-5', title: 'Revisión', icon: 'play-circle' },
  { id: 'step-6', title: 'Revisión', icon: 'play-circle' },
  { id: 'step-7', title: 'Revisión', icon: 'play-circle' },
  { id: 'step-8', title: 'Revisión', icon: 'play-circle' },
];

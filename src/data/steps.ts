export interface Step {
  id: StepId;
  title: string;
  icon: string;
}

export type StepId =
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'step-5'
  | 'step-6'
  | 'step-7'
  | 'step-8'
  | 'step-9'
  | 'step-10'
  | 'step-11'
  | 'step-12';

export const STEP_STATE = {
  'step-1': { prev: null, next: 'step-2' },
  'step-2': { prev: 'step-1', next: 'step-3' },
  'step-3': { prev: 'step-2', next: 'step-4' },
  'step-4': { prev: 'step-3', next: 'step-5' },
  'step-5': { prev: 'step-4', next: 'step-6' },
  'step-6': { prev: 'step-5', next: 'step-7' },
  'step-7': { prev: 'step-6', next: 'step-8' },
  'step-8': { prev: 'step-7', next: 'step-9' },
  'step-9': { prev: 'step-8', next: 'step-10' },
  'step-10': { prev: 'step-9', next: 'step-11' },
  'step-11': { prev: 'step-10', next: 'step-12' },
  'step-12': { prev: 'step-11', next: null },
} as const;

export const STEPS: Step[] = [
  { id: 'step-1', title: 'Zonas', icon: 'map' },
  { id: 'step-2', title: 'Especies', icon: 'paw' },
  { id: 'step-3', title: 'Cantidades', icon: 'calculator' },
  { id: 'step-4', title: 'Comportamiento', icon: 'eye' },
  { id: 'step-5', title: 'Actuación', icon: 'flash' },
  { id: 'step-6', title: 'Interacción', icon: 'people' },
  { id: 'step-7', title: 'Método', icon: 'build' },
  { id: 'step-8', title: 'Animal', icon: 'paw' },
  { id: 'step-9', title: 'Eficacia', icon: 'checkmark-circle' },
  { id: 'step-10', title: 'Captura', icon: 'camera' },
  { id: 'step-11', title: 'Observaciones', icon: 'document-text' },
  { id: 'step-12', title: 'Resumen', icon: 'list' },
];

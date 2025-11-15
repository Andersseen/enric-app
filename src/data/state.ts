import { STEP_ID } from './steps';

export type State = {
  [key in STEP_ID]: StateItem;
};

export interface StateItem {
  label: string;
  value: unknown | null;
}

export const STATE: State = {
  'step-1': { label: 'Mapa', value: null },
  'step-2': { label: 'Especies', value: null },
  'step-3': { label: 'Formulario', value: null },
  'step-4': { label: 'Finalizar', value: null },
};

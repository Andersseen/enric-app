import { StepId } from './steps';

export type State = {
  [key in StepId]: StateItem;
};

export interface StateItem {
  label: string;
  value: unknown | null;
}

export enum STEP_ID {
  Step1 = 'step-1',
  Step2 = 'step-2',
  Step3 = 'step-3',
  Step4 = 'step-4',
  Step5 = 'step-5',
  Step6 = 'step-6',
  Step7 = 'step-7',
  Step8 = 'step-8',
}

export const STATE: State = {
  [STEP_ID.Step1]: { label: 'Mapa', value: null },
  [STEP_ID.Step2]: { label: 'Especies', value: null },
  [STEP_ID.Step3]: { label: 'Formulario', value: null },
  [STEP_ID.Step4]: { label: 'Finalizar', value: null },
  [STEP_ID.Step5]: { label: 'Finalizar', value: null },
  [STEP_ID.Step6]: { label: 'Finalizar', value: null },
  [STEP_ID.Step7]: { label: 'Finalizar', value: null },
  [STEP_ID.Step8]: { label: 'Finalizar', value: null },
};

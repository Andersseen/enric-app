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
  Step9 = 'step-9',
  Step10 = 'step-10',
  Step11 = 'step-11',
  Step12 = 'step-12',
}

export const STATE: State = {
  [STEP_ID.Step1]: { label: 'Zona', value: null },
  [STEP_ID.Step2]: { label: 'Especie', value: null },
  [STEP_ID.Step3]: { label: 'Número', value: null },
  [STEP_ID.Step4]: { label: 'Comportamiento', value: null },
  [STEP_ID.Step5]: { label: 'Tipo de actuación', value: null },
  [STEP_ID.Step6]: { label: 'Interacción operación', value: null },
  [STEP_ID.Step7]: { label: 'Método empleado', value: null },
  [STEP_ID.Step8]: { label: 'Animal empleado', value: null },
  [STEP_ID.Step9]: { label: 'Eficacia', value: null },
  [STEP_ID.Step10]: { label: 'Captura número individuo', value: null },
  [STEP_ID.Step11]: { label: 'Observaciones', value: null },
  [STEP_ID.Step12]: { label: 'Resumen', value: null },
};

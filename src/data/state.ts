import { BaseState, BaseStateItem } from './base-types';
import { StepId } from './steps';

// Reutiliza BaseStateItem en lugar de redefinirlo
export type StateItem = BaseStateItem;

// Extiende BaseState con StepId específico
export type State = BaseState<StepId>;

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
  Step13 = 'step-13',
}

export const STATE: State = {
  [STEP_ID.Step1]: { label: 'Zona', value: null },
  [STEP_ID.Step2]: { label: 'Especie', value: null },
  [STEP_ID.Step3]: { label: 'Número', value: null },
  [STEP_ID.Step4]: { label: 'Comportamiento', value: null },
  [STEP_ID.Step5]: { label: 'Tipo de actuación', value: null },
  [STEP_ID.Step6]: { label: 'Operación', value: null },
  [STEP_ID.Step7]: { label: 'Interacción operación', value: null },
  [STEP_ID.Step8]: { label: 'Método empleado', value: null },
  [STEP_ID.Step9]: { label: 'Animal empleado', value: null },
  [STEP_ID.Step10]: { label: 'Eficacia', value: null },
  [STEP_ID.Step11]: { label: 'Captura número individuo', value: null },
  [STEP_ID.Step12]: { label: 'Observaciones', value: null },
  [STEP_ID.Step13]: { label: 'Resumen', value: null },
};

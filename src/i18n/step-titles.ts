import type { StepId } from '@data/steps';
import type { MessageKey } from './i18n';

/** Título de cada paso del flujo de Actuación. */
export const ACTING_STEP_TITLES: Record<StepId, MessageKey> = {
  'step-1': 'steps.zone',
  'step-2': 'steps.species',
  'step-3': 'steps.count',
  'step-4': 'steps.behavior',
  'step-5': 'steps.actionType',
  'step-6': 'steps.operation',
  'step-7': 'steps.interaction',
  'step-8': 'steps.method',
  'step-8b': 'steps.flightBird',
  'step-9': 'steps.animal',
  'step-10': 'steps.efficacy',
  'step-11': 'steps.captured',
  'step-12': 'steps.observations',
  'step-13': 'steps.summary',
};

/**
 * Título de cada paso del flujo de Trampas. Trampas no tiene paso de
 * "Operación", así que a partir del paso 6 los títulos van desplazados
 * respecto a Actuación.
 */
export const TRAPS_STEP_TITLES: Record<StepId, MessageKey> = {
  'step-1': 'steps.zone',
  'step-2': 'steps.species',
  'step-3': 'steps.count',
  'step-4': 'steps.behavior',
  'step-5': 'steps.actionType',
  'step-6': 'steps.interaction',
  'step-7': 'steps.method',
  'step-8': 'steps.animal',
  'step-8b': 'steps.flightBird', // no se usa en Trampas
  'step-9': 'steps.efficacy',
  'step-10': 'steps.captured',
  'step-11': 'steps.observations',
  'step-12': 'steps.summary',
  'step-13': 'steps.summary',
};

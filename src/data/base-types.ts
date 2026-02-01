export type BaseStepId = string;

export interface BaseStep<TStepId extends BaseStepId = BaseStepId> {
  id: TStepId;
  title: string;
  icon: string;
}

export interface BaseStateItem {
  label: string;
  value: unknown | null;
}

export type BaseState<TStepId extends BaseStepId = BaseStepId> = {
  [key in TStepId]: BaseStateItem;
};

export type BaseStepNavigation<TStepId extends BaseStepId = BaseStepId> = {
  prev: TStepId | null;
  next: TStepId | null;
};

export type BaseStepNavigationMap<TStepId extends BaseStepId = BaseStepId> = {
  readonly [key in TStepId]: BaseStepNavigation<TStepId>;
};

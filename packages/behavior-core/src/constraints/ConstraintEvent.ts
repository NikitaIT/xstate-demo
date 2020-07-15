import { ConstraintEventName } from "./ConstraintEventName";

export type ConstraintEvent<TData> = {
  type: ConstraintEventName.update;
} & TData;

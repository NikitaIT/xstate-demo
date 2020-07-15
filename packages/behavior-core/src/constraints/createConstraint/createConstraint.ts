import { Condition, EventObject } from "xstate";
import { BooleanStateName } from "../BooleanStateName";
import { ConstraintEventName } from "../ConstraintEventName";
import { idle } from "../idle";

export function createConstraint<TContext, TEvent extends EventObject>(
  cond: Condition<TContext, TEvent>
) {
  return {
    initial: BooleanStateName.on, // all constraints resolved before first changes be applyed
    states: {
      [idle]: {
        // same as on: { '': [...] } as always
        on: {
          "": [
            {
              target: BooleanStateName.on,
              cond,
            },
            {
              target: BooleanStateName.off,
            },
          ],
        },
      },
      ...staticPartOfConstraint,
    },
  };
}

// avoid too many memory alloc
const staticPartOfConstraint = {
  [BooleanStateName.on]: {
    on: {
      [ConstraintEventName.update]: [
        {
          target: BooleanStateName.off,
        },
      ],
    },
  },
  [BooleanStateName.off]: {
    on: {
      [ConstraintEventName.update]: [
        {
          target: BooleanStateName.on,
        },
      ],
    },
  },
};

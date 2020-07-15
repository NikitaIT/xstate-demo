import { ConstraintEvent } from "../core/constraints";

export namespace Autobinding {
  export const enum Guard {
    allowed = "autobindingAllowed",
  }
  export type Event = ConstraintEvent<{ autobinding: boolean }>;
  export const Guards = {
    [Guard.allowed]: {
      constraint: {
        type: Guard.allowed,
        name: "not seted",
      },
      resolver: {
        [Guard.allowed]: (context: any, { autobinding }: Event) => autobinding,
      },
    },
  };
}

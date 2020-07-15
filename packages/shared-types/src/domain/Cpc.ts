import { ConstraintEvent } from "../core/constraints";
import { inRange } from "../core/math";

export namespace Cpc {
  export const enum Guard {
    inRange = "cpcInRange",
  }
  export type Event = ConstraintEvent<{ cpc: number }>;
  export const Guards = {
    [Guard.inRange]: {
      constraint: {
        type: Guard.inRange,
        name: "0.10 < _ < 150 rub",
      },
      resolver: {
        [Guard.inRange]: (context: any, { cpc }: Event) =>
          inRange(0.1, 150)(cpc),
      },
    },
  };
}

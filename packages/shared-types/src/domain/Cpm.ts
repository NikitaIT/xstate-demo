import { ConstraintEvent } from "../core/constraints";
import { inRange } from "../core/math";

export namespace Cpm {
  export const enum Guard {
    inRange = "cpmInRange",
  }
  export type Event = ConstraintEvent<{ cpm: number }>;
  export const Guards = {
    [Guard.inRange]: {
      constraint: {
        type: Guard.inRange,
        name: "30 < _ < 1000 rub",
      },
      resolver: {
        [Guard.inRange]: (context: any, { cpm }: Event) =>
          inRange(30, 1000)(cpm),
      },
    },
  };
}

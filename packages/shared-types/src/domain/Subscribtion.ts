import { ConstraintEvent } from "../core/constraints";
import { inRange } from "../core/math";

export namespace Subscribtion {
  export const enum Guard {
    inRange = "subscribtionInRange",
  }
  export type Event = ConstraintEvent<{ subscribtion: number }>;
  export const Guards = {
    [Guard.inRange]: {
      constraint: {
        type: Guard.inRange,
        name: "1 < _ < 500 rub",
      },
      resolver: {
        [Guard.inRange]: (context: any, { subscribtion }: Event) =>
          inRange(1, 500)(subscribtion),
      },
    },
  };
}

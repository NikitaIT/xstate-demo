import { ConstraintEvent } from "../core/constraints";
import { inRange } from "../core/math";

export namespace Req {
  export const enum Guard {
    inRange = "reqInRange",
  }
  export type Event = ConstraintEvent<{ req: number }>;
  export const Guards = {
    [Guard.inRange]: {
      constraint: {
        type: Guard.inRange,
        name: "0.10 < _ < 10000 rub",
      },
      resolver: {
        [Guard.inRange]: (context: any, { req }: Event) =>
          inRange(0.1, 10000)(req),
      },
    },
  };
}

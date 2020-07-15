import { createMachine, StateNodeConfig, StatesConfig } from "xstate";
import { createConstraint } from "../core/constraints/createConstraint/createConstraint";
import { Autobinding } from "../domain/Autobinding";
import { CostType } from "../domain/CostType";
import { Cpc } from "../domain/Cpc";
import { Cpm } from "../domain/Cpm";
import { Req } from "../domain/Req";
import { Subscribtion } from "../domain/Subscribtion";

type Event = any;
interface SharedContext {}
type Context = {
  value: StateName;
  context: SharedContext;
};
export const enum StateName {
  cpc = "cpc",
  cpm = "cpm",
  cpcMax = "cpcMax",
  cpmMax = "cpmMax",
  subscribtion = "subscribtion",
  req = "req",
  autobinding = "autobinding",
  costType = "costType",
}

const autobindingState: StateNodeConfig<SharedContext, any, Event> = {
  type: "parallel",
  states: {},
};
const states: StatesConfig<SharedContext, any, Event> = {
  [StateName.costType]: createConstraint<SharedContext, Event>(
    CostType.Guards[CostType.Guard.inRange].constraint
  ),
  [StateName.autobinding]: createConstraint<SharedContext, Event>(
    Autobinding.Guards[Autobinding.Guard.allowed].constraint
  ),
  [StateName.cpc]: createConstraint<SharedContext, Cpc.Event>(
    Cpc.Guards[Cpc.Guard.inRange].constraint
  ),
  [StateName.cpcMax]: createConstraint<SharedContext, Cpc.Event>(
    Cpc.Guards[Cpc.Guard.inRange].constraint
  ),
  [StateName.cpm]: createConstraint<SharedContext, Cpm.Event>(
    Cpm.Guards[Cpm.Guard.inRange].constraint
  ),
  [StateName.cpmMax]: createConstraint<SharedContext, Cpm.Event>(
    Cpm.Guards[Cpm.Guard.inRange].constraint
  ),
  [StateName.req]: createConstraint<SharedContext, Req.Event>(
    Req.Guards[Req.Guard.inRange].constraint
  ),
  [StateName.subscribtion]: createConstraint<SharedContext, Subscribtion.Event>(
    Subscribtion.Guards[Subscribtion.Guard.inRange].constraint
  ),
};

export const machine = createMachine<SharedContext, Event, Context>({
  key: "root",
  type: "parallel",
  states,
});

machine.withConfig(
  {
    guards: [
      Autobinding.Guards[Autobinding.Guard.allowed],
      Cpc.Guards[Cpc.Guard.inRange],
      Cpm.Guards[Cpm.Guard.inRange],
      Req.Guards[Req.Guard.inRange],
      CostType.Guards[CostType.Guard.inRange],
      Subscribtion.Guards[Subscribtion.Guard.inRange],
    ].reduce(extractResolvers, {}),
    actions: {},
  },
  {}
);

function extractResolvers<T, R, K extends { resolver: R }>(
  acc: T,
  value: K
): T & R {
  return { ...acc, ...value.resolver };
}

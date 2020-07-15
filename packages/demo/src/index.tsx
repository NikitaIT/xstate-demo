import { machine, name as projectName } from "@statex-demo/shared-types";
import ReactDOM from "react-dom";
import React from "react";
import { interpret } from "xstate";

ReactDOM.render(<App name="Demo" />, document.querySelector("#container"));

function App({ name }: any) {
  const e = interpret(machine, { devTools: true });
  console.log(e);
  e.start();

  return (
    <div>
      Hello {name} and {projectName()}! {e.initialState.toStrings()}
    </div>
  );
}

const t = module as any;
if (t && t.hot) {
  t.hot.accept();

  t.hot.addStatusHandler((status: any) => {
    if (status === "prepare") console.clear();
  });
}

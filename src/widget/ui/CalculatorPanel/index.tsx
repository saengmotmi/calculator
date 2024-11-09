import { useSyncExternalStore } from "react";

import {
  BackspaceButton,
  ClearButton,
  EqualsButton,
  NumberButton,
  OperatorButton,
} from "./Button/types";
import { calculatorStore } from "../../../features/calculator/calculatorStore";
import Display from "./Display";
import { Button, buttonRows } from "./Button";

const CalculatorPanel = () => {
  const { expression, result } = useSyncExternalStore(
    calculatorStore.subscribe,
    calculatorStore.getSnapshot
  );

  return (
    <div>
      <Display expression={expression} result={result ?? 0} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {buttonRows.flat().map((button) => {
          if (button instanceof ClearButton) {
            return (
              <Button
                key={button.label}
                label={button.label}
                onClick={() => calculatorStore.clear()}
              />
            );
          } else if (button instanceof BackspaceButton) {
            return (
              <Button
                key={button.label}
                label={button.label}
                onClick={() => calculatorStore.backspace()}
              />
            );
          } else if (button instanceof EqualsButton) {
            return (
              <Button
                key={button.label}
                label={button.label}
                onClick={() => calculatorStore.calculate()}
              />
            );
          } else {
            return (
              <Button
                key={button.label}
                label={button.label}
                onClick={() => calculatorStore.input(button.label)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default CalculatorPanel;

import { useSyncExternalStore } from "react";

import { BackspaceButton, ClearButton, EqualsButton } from "./Button/types";
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
          return (
            <Button
              key={button.label}
              label={button.label}
              onClick={() => {
                if (button instanceof ClearButton) {
                  calculatorStore.clear();
                } else if (button instanceof BackspaceButton) {
                  calculatorStore.backspace();
                } else if (button instanceof EqualsButton) {
                  calculatorStore.calculate();
                } else {
                  calculatorStore.input(button.label);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalculatorPanel;

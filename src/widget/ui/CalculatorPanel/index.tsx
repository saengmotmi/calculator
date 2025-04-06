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
import { useCalculatorKeyInput } from "./hooks";

const CalculatorPanel = () => {
  const { expression, result } = useSyncExternalStore(
    calculatorStore.subscribe,
    calculatorStore.getSnapshot
  );

  useCalculatorKeyInput();

  return (
    <div role="application" aria-label="계산기">
      <Display expression={expression} result={result ?? 0} />
      <div
        role="group"
        aria-label="계산기 키패드"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {buttonRows.flat().map((button) => (
          <Button
            key={button.label}
            label={button.label}
            onClick={() => button.onClick()}
            aria-label={button.getAriaLabel()}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculatorPanel;

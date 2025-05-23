import { calculatorStore } from "../../../features/calculator/calculatorStore";
import Display from "./Display";
import { Button, createButtonLayout } from "./Button";
import { useCalculatorKeyInput, useCalculatorDisplay } from "./hooks";
import { CalculatorActions } from "./Button/types";

const CalculatorPanel = () => {
  // UI 레이어에서 표현 로직 처리
  const { expression, result, hasError, errorMessage } = useCalculatorDisplay();

  useCalculatorKeyInput();

  // 계산기 액션 객체 생성 (의존성 주입)
  const actions: CalculatorActions = {
    input: (value: string) => calculatorStore.input(value),
    calculate: () => calculatorStore.calculate(),
    clear: () => calculatorStore.clear(),
    backspace: () => calculatorStore.backspace(),
  };

  // 새로운 함수형 버튼 레이아웃 사용
  const buttonLayout = createButtonLayout(actions);

  // 표시할 값 결정 (에러 상태 고려)
  const displayExpression = hasError ? errorMessage || "Error" : expression;
  const displayResult = hasError ? 0 : result ? Number(result) || 0 : 0;

  return (
    <div role="application" aria-label="계산기">
      <Display expression={displayExpression} result={displayResult} />
      <div
        role="group"
        aria-label="계산기 키패드"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {buttonLayout.flat().map((buttonConfig) => (
          <Button
            key={buttonConfig.label}
            label={buttonConfig.label}
            onClick={() => buttonConfig.onClick(actions)}
            aria-label={buttonConfig.getAriaLabel()}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculatorPanel;

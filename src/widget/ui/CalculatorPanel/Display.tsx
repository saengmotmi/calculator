interface DisplayProps {
  expression: string;
  result: number;
}

const Display = ({ expression, result }: DisplayProps) => {
  return (
    <div
      role="region"
      aria-label="계산기 디스플레이"
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ddd",
      }}
    >
      <div aria-label="수식" style={{ fontSize: "24px", marginBottom: "5px" }}>
        {expression}
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="계산 결과"
        style={{ fontSize: "32px", color: "#000" }}
      >
        {result}
      </div>
    </div>
  );
};

export default Display;

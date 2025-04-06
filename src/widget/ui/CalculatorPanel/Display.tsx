interface DisplayProps {
  expression: string;
  result: number;
}

const Display = ({ expression, result }: DisplayProps) => {
  return (
    <div
      role="display"
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ddd",
      }}
    >
      <div
        data-testid="expression-display"
        style={{ fontSize: "24px", marginBottom: "5px" }}
      >
        {expression}
      </div>
      <div
        data-testid="result-display"
        style={{ fontSize: "32px", color: "#000" }}
      >
        {result}
      </div>
    </div>
  );
};

export default Display;

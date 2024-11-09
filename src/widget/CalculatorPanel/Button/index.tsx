interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "15px",
        fontSize: "18px",
        cursor: "pointer",
        border: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        transition: "background-color 0.3s",
      }}
    >
      {label}
    </button>
  );
};

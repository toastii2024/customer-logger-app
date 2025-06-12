export function Button({ children, onClick, variant = "default", className = "" }) {
  const base =
    "px-4 py-2 rounded-lg transition font-medium";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
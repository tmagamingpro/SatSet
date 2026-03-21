const Button = ({ children, variant = "primary", size = "md", type = "button", onClick, disabled, fullWidth, icon, className = "" }) => {
  const base = `inline-flex items-center justify-center gap-2 font-semibold border-none transition-all duration-200 rounded-lg cursor-pointer
    ${disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}
    ${fullWidth ? "w-full" : ""}`;

  const variants = {
    primary: "bg-sky-600 text-white",
    secondary: "bg-slate-900 text-white",
    outline: "bg-transparent text-sky-600 border-2 border-sky-600",
    ghost: "bg-transparent text-gray-500",
    danger: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;


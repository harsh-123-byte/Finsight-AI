const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",

  outline:
    "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        hover:scale-105
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
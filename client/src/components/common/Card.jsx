const Card = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        bg-slate-900/70
        backdrop-blur-xl
        border
        border-slate-700
        rounded-2xl
        p-6
        shadow-lg
        hover:border-blue-500
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
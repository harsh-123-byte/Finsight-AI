const MetricCard = ({
  title,
  value,
  color,
}) => {
  return (
    <div
      className="
      rounded-xl
      border
      border-slate-700
      bg-slate-800
      p-4
    "
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2
        className={`mt-2 text-2xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
};

export default MetricCard;
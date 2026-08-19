// It is a React functional component that renders a card displaying a metric with a title and value. The card has a rounded border, background color, and padding. The title is displayed in smaller text, while the value is displayed in larger, bold text with a customizable color. The component takes three props: `title`, `value`, and `color`, which are used to populate the content and style of the card.
// Metric means a numerical value that represents a specific aspect of a system or process. In this context, it refers to the data being displayed on the card, such as financial metrics, performance metrics, or any other quantifiable information relevant to the application.

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
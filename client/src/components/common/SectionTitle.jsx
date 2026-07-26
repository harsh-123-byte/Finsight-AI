const SectionTitle = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center space-y-3">
      <h2
        className="
        text-4xl
        font-bold
      "
      >
        {title}
      </h2>

      <p
        className="
        text-slate-400
        max-w-2xl
        mx-auto
      "
      >
        {subtitle}
      </p>
    </div>
  );
};

export default SectionTitle;
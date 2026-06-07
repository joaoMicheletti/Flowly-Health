interface CardProps {
  title: string;

  value: string | number;
}

export function Card({
  title,
  value,
}: CardProps) {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-slate-800">
        {value}
      </h2>
    </div>
  );
}
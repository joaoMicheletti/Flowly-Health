interface CardProps {
  title: string;

  value: string | number;
}

export function Card({
  title,
  value,
}: CardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <span className="text-sm text-slate-500">
        {title}
      </span>

      <h2 className="mt-2 text-3xl font-bold text-slate-800">
        {value}
      </h2>
    </div>
  );
}
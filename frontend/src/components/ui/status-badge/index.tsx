interface StatusBadgeProps {
  status: string;
}

const statusColors = {
  SCHEDULED:
    'bg-yellow-100 text-yellow-700',

  CONFIRMED:
    'bg-green-100 text-green-700',

  CANCELLED:
    'bg-red-100 text-red-700',

  COMPLETED:
    'bg-blue-100 text-blue-700',
};

const statusLabels = {
  SCHEDULED: 'Agendada',

  CONFIRMED: 'Confirmada',

  CANCELLED: 'Cancelada',

  COMPLETED: 'Concluída',
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        statusColors[
          status as keyof typeof statusColors
        ]
      }`}
    >
      {
        statusLabels[
          status as keyof typeof statusLabels
        ]
      }
    </span>
  );
}
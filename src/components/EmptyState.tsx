import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-wheat bg-cream-dark/50 px-6 py-12 text-center">
      <div className="mb-3 text-wheat">{icon}</div>
      <h3 className="font-serif text-lg font-semibold text-brown">{title}</h3>
      <p className="mt-1 text-sm text-brown-light">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

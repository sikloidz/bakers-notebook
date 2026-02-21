import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-serif text-2xl font-bold text-brown-dark">{title}</h1>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

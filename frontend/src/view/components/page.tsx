import { ReactNode } from "react";
import "./page.css";

interface PageProps {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={`page ${className}`}>
      <div className="content">{children}</div>
    </div>
  );
}

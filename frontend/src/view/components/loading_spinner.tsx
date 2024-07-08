import "./loading_spinner.css";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return <div className={`loading-spinner ${className}`} />;
}

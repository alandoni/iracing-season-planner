import { memo, ReactNode } from "react"
import "./column.css"

export type ColumnHorizontalAlignment = "normal" | "start" | "center" | "end"
export type ColumnVerticalAlignment = "stretch" | "start" | "center" | "end"

interface ColumnProps {
  children?: ReactNode
  className?: string
  alignHorizontally?: ColumnHorizontalAlignment
  alignVertically?: ColumnVerticalAlignment
  onClick?: () => void
}

export const Column = memo(
  ({ children, className = "", alignHorizontally = "normal", alignVertically = "start", onClick }: ColumnProps) => {
    return (
      <div
        className={`column ${className} column-halign-${alignHorizontally} column-valign-${alignVertically}`}
        onClick={onClick}
      >
        {children}
      </div>
    )
  },
)

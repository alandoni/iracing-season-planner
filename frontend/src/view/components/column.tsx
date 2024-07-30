import { ForwardedRef, forwardRef, memo, ReactNode } from "react"
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

const ColumnView = function (
  { children, className = "", alignHorizontally = "normal", alignVertically = "start", onClick }: ColumnProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`column ${className} column-halign-${alignHorizontally} column-valign-${alignVertically}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const forwardedView = forwardRef(ColumnView)

export const Column = memo(forwardedView)

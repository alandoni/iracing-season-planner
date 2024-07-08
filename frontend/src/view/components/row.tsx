import { CSSProperties, ForwardedRef, forwardRef, memo, ReactNode } from "react"
import "./row.css"

export type RowHorizontalAlignment = "start" | "center" | "end" | "space-between"
export type RowVerticalAlignment = "start" | "center" | "end" | "baseline" | "stretch"

interface RowProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  alignHorizontally?: RowHorizontalAlignment
  alignVertically?: RowVerticalAlignment
  onClick?: () => void
}

const RowView = function (
  { children, className = "", style, alignHorizontally = "start", alignVertically = "center", onClick }: RowProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`row ${className} row-halign-${alignHorizontally} row-valign-${alignVertically}`}
      style={style}
    >
      {children}
    </div>
  )
}

const forwardedView = forwardRef(RowView)

export const Row = memo(forwardedView)

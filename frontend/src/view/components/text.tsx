import { memo, ReactNode } from "react"
import "./text.css"

interface TextProps {
  size?: "small" | "regular" | "large"
  relevance?: "important" | "regular" | "irrelevant" | "error" | "warning" | "info" | "placeholder"
  wrap?: boolean
  ellipsis?: boolean
  children: ReactNode
  color?: string
  tooltip?: string
}

export const Text = memo(
  ({ children, color, size = "regular", relevance = "regular", ellipsis = false, wrap = true, tooltip }: TextProps) => {
    return (
      <span
        data-testid="text_test"
        className={`text size-${size} relevance-${relevance} ${ellipsis ? "ellipsis" : ""} ${wrap ? "" : "nowrap"}`}
        style={{ color: color }}
        title={tooltip}
      >
        {children}
      </span>
    )
  },
)

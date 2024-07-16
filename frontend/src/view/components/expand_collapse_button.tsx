import Arrow from "assets/arrow.svg?react"
import "./expand_collapse_button.css"

interface ExpandCollapseButtonProps {
  isExpanded: boolean
  onSetExpanded: (expanded: boolean) => void
}

export function ExpandCollapseButton({ isExpanded, onSetExpanded }: ExpandCollapseButtonProps) {
  return (
    <div
      className={`expand-collapse-button ${isExpanded ? "expanded" : "collapsed"}`}
      onClick={() => onSetExpanded(!isExpanded)}
    >
      <Arrow viewBox="0 0 48 48" />
    </div>
  )
}

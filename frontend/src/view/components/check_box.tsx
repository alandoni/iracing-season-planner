import Check from "assets/check.svg?react"
import "./check_box.css"

interface CheckboxProps {
  isChecked: boolean
  small?: boolean
  name?: string
  enabled?: boolean
  onChange?: (checked: boolean, target: { name: string }) => void
  tooltip?: string
}

export const Checkbox = ({ isChecked, name = "", enabled = true, onChange, tooltip, small = false }: CheckboxProps) => {
  return (
    <span className={`checkbox ${small ? "small" : ""}`} title={tooltip}>
      <input
        data-testid="checkbox_test"
        id={name}
        name={name}
        className={`${small ? "small" : ""}`}
        type="checkbox"
        disabled={!enabled}
        checked={isChecked}
        onChange={(event) => {
          onChange?.(event.target.checked, event.target)
        }}
      />
      <Check className="check" viewBox="0 0 48 48" />
    </span>
  )
}

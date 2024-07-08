import "./range.css"

interface RangeProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
}

export function Range({ min = 0, max = 10, step = 1, value = 0, onChange }: RangeProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}

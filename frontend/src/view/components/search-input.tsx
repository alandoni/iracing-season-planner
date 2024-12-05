import "./search-input.css"
import { useDebounceField } from "frontend/utils/react_hooks/use_debounce_field"

interface SearchInputProps {
  value: string
  onChange: (text: string) => void
  delay?: number
  minChars?: number
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  delay = 300,
  minChars = 1,
  placeholder = "Pesquisar",
}: SearchInputProps) {
  const [text, setText] = useDebounceField(value, onChange, delay, minChars)

  return (
    <input className="search-input" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
  )
}

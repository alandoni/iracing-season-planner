import { useState } from "react"
import "./search-input.css"

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
  const [text, setText] = useState(value)
  const [timeout, handleTimeout] = useState<number>()

  const onChangeText = (text: string) => {
    setText(text)
    clearTimeout(timeout)
    handleTimeout(
      setTimeout(() => {
        if (text.length > minChars) {
          onChange(text)
        }
      }, delay),
    )
  }

  return (
    <input
      className="search-input"
      value={text}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
    />
  )
}

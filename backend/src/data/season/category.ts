export type Category = { id: number; name: string }

export function formatCategory(value: string) {
  return value
    .split(/[_\s]+/)
    .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
    .join(" ")
}

export function findInName(name: string, search: string) {
  return name.split(/[\s-_]+/).find((n) => n.toLowerCase().includes(search.toLowerCase())) !== undefined
}

export function findInName(name: string, search: string) {
  const spaceRegex = /[\s-_]+/

  if (search.startsWith('"') && search.endsWith('"')) {
    return name.includes(search.substring(1, search.length - 1))
  }

  return (
    name
      .toLowerCase()
      .split(spaceRegex)
      .find((n) =>
        search
          .toLowerCase()
          .split(spaceRegex)
          .some((s) => n.includes(s)),
      ) !== undefined
  )
}

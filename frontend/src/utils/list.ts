export function removeFromList<T>(
  element: T,
  array: Array<T>,
  comparator: (element: T, other: T) => boolean = (element, other) => element === other,
) {
  const index = array.findIndex((o) => comparator(element, o)) ?? -1
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}

export function removeDuplicates<T>(array: T[], comparison: (a: T, b: T) => boolean) {
  return array.filter((value, index, a) => {
    return (
      a.findIndex((value2) => {
        return comparison(value, value2)
      }) === index
    )
  })
}

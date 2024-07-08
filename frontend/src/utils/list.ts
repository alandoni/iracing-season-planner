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

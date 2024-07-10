export function sortLicenses(licenses: License[]) {
  return licenses.sort((a, b) => a.id - b.id)
}

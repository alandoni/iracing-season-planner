export function formatPrice(value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  return formatter.format(value)
}

export type Track = {
  id: number
  category: string
  categoryId: number
  location: string
  maxCars: number
  name: string
  free: boolean
  price: number
  retired: boolean
  url: string
  types: string[]
  rainEnabled: boolean
  configs: {
    name: string
    closes: Date
    opens: Date
    id: number
    dirpath: string
    length: number
    corners: number
  }[]
}

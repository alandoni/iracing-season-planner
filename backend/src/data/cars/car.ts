export type Car = {
  id: number
  dirpath: string
  name: string
  classes: { id: number; name: string }[]
  abbreviation: string
  types: string[]
  weight: number
  hp: number
  categories: string[]
  forumUrl: string
  free: boolean
  headlights: boolean
  price: number
  rainEnabled: boolean
  retired: boolean
}

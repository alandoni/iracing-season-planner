export class Category {
  constructor(public id: number, private _name: string) {}

  get name(): string {
    return this._name
      .split(/[_\s]+/)
      .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
      .join(" ")
  }
}

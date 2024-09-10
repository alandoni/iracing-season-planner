export interface ServerInterface<Request, Response, Next> {
  init(): Promise<void>
  get(url: string, callback: (req: Request, res: Response, next: Next) => Promise<void> | void): void
}

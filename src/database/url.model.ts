export class Url {
  constructor(
    public id: number,
    public originalUrl: string,
    public shortUrlHash: string,
    public shortUrlBase62: string,
  ) {}
}

export default abstract class BaseApiService {
  protected readonly _url: string

  constructor(url: string) {
    this._url = url
  }
}

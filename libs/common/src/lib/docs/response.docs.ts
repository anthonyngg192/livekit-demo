export class ReturnOKDocs<T> {
  constructor(public data: T) {
    this.data = data;
  }
}

export class ResponseDocs<T = any> {
  constructor(public data: T) {
    this.data = data;
  }
}

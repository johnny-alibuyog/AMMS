class ResourceBuilder {
  private _resource: string;

  constructor(prefix: string = '') {
    this._resource = prefix;
  }

  public resource(resource: string): ResourceBuilder {
    this._resource += `/${resource}`;
    return this;
  }

  public param(paramName: string): ResourceBuilder {
    this._resource += `/:${paramName}`
    return this;
  }

  public paramval(paramval: string): ResourceBuilder {
    this._resource += `/${paramval}`
    return this;
  }

  public build(): string {
    return this._resource;
  }
}

export { ResourceBuilder }
export class User {
  constructor(
    public name: string,
    public createdAt: string = new Date().toISOString()
  ) {}

  static fromJSON(json: any): User {
    return new User(
      json.name,
      json.createdAt
    );
  }

  toJSON() {
    return {
      name: this.name,
      createdAt: this.createdAt
    };
  }
} 
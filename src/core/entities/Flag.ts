/* eslint-disable import/prefer-default-export */
export class Flag {
  id: string;

  name: string;

  imageUrl: string;

  constructor(name: string, imageUrl: string) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.imageUrl = imageUrl;
  }
}

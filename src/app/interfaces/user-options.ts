
export class UserOptions {
  id: number;
  username: string;
  password: string;
  constructor() {}
}
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

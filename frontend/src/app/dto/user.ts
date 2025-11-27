export interface User {
  id: number;
  name: string;
  level: number;
}

export interface Users {
  users: User[];
}

export interface CreateUser {
  name: string;
  level: number;
  password?: string;
}
export interface userToDelete {
  id: number
}

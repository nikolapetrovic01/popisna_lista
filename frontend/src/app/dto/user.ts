export interface user {
  id: number;
  name: string;
  level: number;
}

export interface users {
  users: user[];
}

export interface createUser {
  name: string;
  level: number;
  password?: string;
}

export interface userToDelete {
  id: number
}

export interface userToUpdate {
  id: number,
  name: string,
  level: number
}

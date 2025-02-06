export interface loginRequest {
  name: string;
  password: string;
}

export interface loginResponse{
  name: string;
  level: number;
  id: number;
  jwtToken: string;
}

export interface loginRequest {
  name: string;
  password: string;
  rememberMe: boolean;
}

export interface loginResponse{
  name: string;
  level: number;
  id: number;
  jwtToken: string;
}

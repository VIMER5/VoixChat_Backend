export interface dataRegisterUser {
  login: string;
  username: string;
  email: string;
  password: string;
}

export interface dataLoginUser {
  login: string;
  password: string;
}

export interface TokenPayLoad {
  userId: number;
  login: string;
}

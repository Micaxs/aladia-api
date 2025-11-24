declare module '@common/dto/register-user.dto' {
  export class RegisterUserDto {
    username: string;
    password: string;
    email: string;
    active: boolean;
    country: string;
  }
}

declare module '@common/dto/login.dto' {
  export class LoginDto {
    username: string;
    password: string;
  }
}

declare module '@common/rto/user.rto' {
  export class UserRto {
    id: string;
    username: string;
    email: string;
    active: boolean;
    country: string;
  }
}

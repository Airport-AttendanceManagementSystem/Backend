export class CreateSystemUserDto {
  userName: string;
  password: string;
  userType?: string;
  userStatus?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

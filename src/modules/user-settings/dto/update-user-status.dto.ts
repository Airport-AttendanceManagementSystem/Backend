import { IsIn, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'userStatus must be either "active" or "inactive"',
  })
  userStatus: string; // 'active' | 'inactive'
}

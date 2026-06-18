import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAaslUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Password must contain only letters and numbers',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  userType: string;

  @IsString()
  @IsNotEmpty()
  userStatus: number;
  @IsNumber()
  deptId?: number;
}

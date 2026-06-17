import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AaslUserSectionDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: [1, 3, 5],
    description: 'Array of section numbers to assign to this user',
  })
  @IsArray()
  @IsInt({ each: true })
  @ArrayUnique()
  sections: number[];
}

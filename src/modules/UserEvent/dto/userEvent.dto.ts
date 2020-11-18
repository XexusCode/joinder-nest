import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsAlphanumeric() // Cambiar to int
  @IsNotEmpty()
  @ApiProperty()
  rank: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  color: string;
}

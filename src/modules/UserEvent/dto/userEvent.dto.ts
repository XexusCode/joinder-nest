import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsAlphanumeric() // Cambiar to int
  @IsNotEmpty()
  rank: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}

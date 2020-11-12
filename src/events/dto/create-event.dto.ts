import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsAlphanumeric() // Cambiar to int
  @IsNotEmpty()
  nmax: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  startDate: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  endDate: number;
}

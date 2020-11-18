import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsAlphanumeric() // Cambiar to int
  @IsNotEmpty()
  @ApiProperty()
  nmax: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  @ApiProperty()
  startDate: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  @ApiProperty()
  endDate: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  img: string;
}

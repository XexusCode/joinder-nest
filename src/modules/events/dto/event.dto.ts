import {
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

  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  nmax: number;

  @IsNotEmpty()
  @ApiProperty()
  startDate: string;

  @IsNotEmpty()
  @ApiProperty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  img: string;
}

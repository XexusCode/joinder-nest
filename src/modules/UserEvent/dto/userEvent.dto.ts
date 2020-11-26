import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  rank: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;
}

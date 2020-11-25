import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
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
  @IsNotEmpty()
  @ApiProperty()
  rank: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  color: string;
}

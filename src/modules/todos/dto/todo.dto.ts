import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @IsString()
  @MinLength(4)
  @ApiProperty()
  text: string;
}

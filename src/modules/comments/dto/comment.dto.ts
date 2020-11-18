import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  text: string;

  @ApiProperty()
  @IsOptional()
  date: string;
}

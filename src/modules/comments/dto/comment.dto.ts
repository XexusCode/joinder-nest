import { IsString, MinLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MinLength(4)
  text: string;

  date: string;
}

import { IsString, MinLength } from 'class-validator';

export class TodoDto {
  @IsString()
  @MinLength(4)
  text: string;
}

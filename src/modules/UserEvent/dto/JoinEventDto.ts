import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JoinEventDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

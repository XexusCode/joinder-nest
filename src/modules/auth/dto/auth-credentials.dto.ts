import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @IsString({ message: 'Debe contener caracteres validos' })
  @MinLength(4, { message: 'El minimo numero de caracteres es 4' })
  @MaxLength(20, { message: 'El maximo numero de caracteres es 20' })
  @ApiProperty()
  username: string;

  @MinLength(8, { message: 'El minimo numero de caracteres es 8' })
  @MaxLength(20, { message: 'El maximo numero de caracteres es 20' })
  @ApiProperty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña es muy debil ',
  })
  password: string;
}

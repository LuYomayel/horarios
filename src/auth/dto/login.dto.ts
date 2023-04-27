import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class loginDTO  {
  @IsString({message: 'El nombre del usuario debe ser una cadena de caracteres.'})
  @IsNotEmpty({ message: 'El nombre del usuario no puede estar vacío' })
  @ApiProperty({ description: 'Nombre usuario' })
  readonly nombreUsuario: string;

  @IsString({message: 'La contraseña debe ser una cadena de caracteres.'})
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @ApiProperty({ description: 'Contraseña' })
  readonly contrasenia: string;
}

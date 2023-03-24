import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class createUsuarioDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre usuario' })
  readonly nombreUsuario: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Contraseña' })
  readonly contrasenia: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Contraseña' })
  readonly correo: string;
}

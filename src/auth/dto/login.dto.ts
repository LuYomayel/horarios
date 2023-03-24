import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class loginDTO  {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre usuario' })
  readonly nombreUsuario: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Contraseña' })
  readonly contrasenia: string;
}

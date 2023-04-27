import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfesoreDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @ApiProperty({ description: `Nombre` })
  readonly nombre: string;

  @IsString({ message: 'El apellido debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @ApiProperty({ description: `Apellido` })
  readonly apellido: string;

  @IsNumber({}, { message: 'El cuil debe ser un número' })
  @IsNotEmpty({ message: 'El cuil no puede estar vacío' })
  @IsPositive({ message: 'El cuil debe ser un número positivo' })
  @ApiProperty({ description: `Cuil` })
  readonly cuil: number;
}

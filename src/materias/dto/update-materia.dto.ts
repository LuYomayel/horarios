import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMateriaDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @ApiProperty({ description: 'Nombre de la materia' })
  nombre: string;
}
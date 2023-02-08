import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMateriaDto {
  @ApiProperty({ description: 'Nombre de la materia' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

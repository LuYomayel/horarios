import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

import { Materia } from 'src/materias/entities/materia.entity';

export class CreateProfesoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Nombre` })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Apellido` })
  readonly apellido: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: `Dni` })
  readonly dni: number;

  @ApiProperty({ description: `Materias asociadas` })
  readonly materia: Materia[];
}

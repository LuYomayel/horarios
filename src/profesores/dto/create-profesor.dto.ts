import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsArray,
  isIdentityCard,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Materia } from 'src/materias/entities/materia.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Type } from 'class-transformer';
import { CreateHorarioDto } from '../../horarios/dto/create-horario.dto';

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
  // @isIdentityCard('es-AR')
  @ApiProperty({ description: `Dni` })
  readonly dni: number;
}

import { IsNotEmpty, IsEnum, IsMongoId, IsNumber, IsPositive, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EDia, ETipoProfesor } from '../entities/horario-x-curso.entity';

// Crea un nuevo DTO para representar el objeto que contiene el profesor y el tipo de profesor
class ProfesorTipoDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ description: 'Profesor' })
  readonly profesor: string;

  @IsNotEmpty()
  @IsEnum(ETipoProfesor)
  @ApiProperty({ description: 'Tipo de profesor' })
  readonly tipoProfesor: ETipoProfesor;
}

export class CreateHorarioXCursoDto {
  @IsNotEmpty()
  @IsMongoId()
  materia: string;

  @IsNotEmpty()
  @IsMongoId()
  curso: string;

  @IsNotEmpty()
  @IsMongoId()
  profesor: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(6)
  @Min(1)
  @ApiProperty({ description: 'Modulo' })
  readonly modulo: number;

  @IsNotEmpty()
  @IsEnum(EDia)
  @ApiProperty({ description: 'Dia de la semana' })
  readonly dia: EDia;

  @IsNotEmpty()
  @IsEnum(ETipoProfesor)
  @ApiProperty({ description: 'Tipo de profesor' })
  readonly tipoProfesor: ETipoProfesor;

  // Agrega el campo opcional arrayProfesores
  @ValidateNested({ each: true })
  @Type(() => ProfesorTipoDto)
  @ApiProperty({ description: 'Array de profesores y sus tipos', type: [ProfesorTipoDto], required: false })
  readonly arrayProfesores?: ProfesorTipoDto[];
}

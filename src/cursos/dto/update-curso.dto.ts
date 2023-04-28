import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoDto } from './create-curso.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min,IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETurno } from 'src/horario-x-curso/entities/horario-x-curso.entity';

export class UpdateCursoDto {
  @IsString({message: 'Las notas deben ser una cadena de caracteres.'})
  notas: string;

  @IsNumber({},{ message: 'El año debe ser un numero' })
  @IsPositive({ message: 'El año debe ser positivo'})
  @Min(1, {message: 'El año debe ser mayor o igual a 1'})
  @Max(6, {message: 'El año debe ser menor o igual a 6'})
  @ApiProperty({ description: 'Año del curso' })
  readonly anio: number;

  
  @IsNumber({},{ message: 'La división debe ser un numero' })
  @IsPositive({ message: 'La división debe ser positiva'})
  @Min(1, {message: 'La división debe ser mayor o igual a 1'})
  @Max(6, {message: 'La división debe ser menor o igual a 6'})
  readonly division: number;

  @IsEnum(ETurno, { message: 'El turno debe ser Mañana o Tarde' })
  @IsArray({message: 'Los turnos deben estar en formato de array'})
  @ApiProperty({
    description: 'Turno',
    example: 'Turno mañana, Turno tarde, prehora,etc',
  })
  readonly turno: ETurno;
  
}

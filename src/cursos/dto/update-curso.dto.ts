import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoDto } from './create-curso.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min,IsString, IsMongoId, IsEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETurno } from 'src/horario-x-curso/entities/horario-x-curso.entity';

export class UpdateCursoDto {
  @IsOptional()
  @IsString({message: 'Las notas deben ser una cadena de caracteres.'})
  @ApiProperty({ description: 'Notas del curso' })
  notas?: string;
  
  @IsOptional()
  @IsNumber({},{ message: 'El año debe ser un numero' })
  @IsPositive({ message: 'El año debe ser positivo'})
  @Min(1, {message: 'El año debe ser mayor o igual a 1'})
  @Max(6, {message: 'El año debe ser menor o igual a 6'})
  @ApiProperty({ description: 'Año del curso' })
  anio?: number;
  
  
  @IsOptional()
  @IsNumber({},{ message: 'La división debe ser un numero' })
  @IsPositive({ message: 'La división debe ser positiva'})
  @Min(1, {message: 'La división debe ser mayor o igual a 1'})
  @Max(6, {message: 'La división debe ser menor o igual a 6'})
  @ApiProperty({ description: 'Division del curso' })
  division?: number;
  
  
  @IsOptional()
  @IsArray({message: 'Los turnos deben estar en formato de array'})
  @ApiProperty({
      description: 'Turno',
      example: 'Turno mañana, Turno tarde, prehora,etc',
    })
  turno?: ETurno;
  
}

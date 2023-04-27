import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { ETurno } from '../../horario-x-curso/entities/horario-x-curso.entity';

export class CreateCursoDto {
  
  @IsNotEmpty({ message: 'El año no puede estar vacío' })
  @IsNumber({},{ message: 'El año debe ser un numero' })
  @IsPositive({ message: 'El año debe ser positivo'})
  @Min(1, {message: 'El año debe ser mayor o igual a 1'})
  @Max(6, {message: 'El año debe ser menor o igual a 6'})
  @ApiProperty({ description: 'Año del curso' })
  readonly anio: number;

  @IsNotEmpty({ message: 'La división no puede estar vacía' })
  @IsNumber({},{ message: 'La división debe ser un numero' })
  @IsPositive({ message: 'La división debe ser positiva'})
  @Min(1, {message: 'La división debe ser mayor o igual a 1'})
  @Max(6, {message: 'La división debe ser menor o igual a 6'})
  readonly division: number;

  @IsNotEmpty({ message: 'El turno no puede estar vacío' })
  @IsEnum(ETurno, { message: 'El turno debe ser Mañana o Tarde' })
  @IsArray({message: 'Los turnos deben estar en formato de array'})
  @ApiProperty({
    description: 'Turno',
    example: 'Turno mañana, Turno tarde, prehora,etc',
  })
  readonly turno: ETurno;
}

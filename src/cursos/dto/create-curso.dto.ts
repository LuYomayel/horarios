import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { ETurno } from '../../horario-x-curso/entities/horario-x-curso.entity';

export class CreateCursoDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(6)
  @ApiProperty({ description: 'Año del curso' })
  readonly anio: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(6)
  readonly division: number;

  @IsNotEmpty()
  @IsEnum(ETurno)
  @IsArray()
  @ApiProperty({
    description: 'Turno',
    example: 'Turno mañana, Turno tarde, prehora,etc',
  })
  readonly turno: ETurno;
}

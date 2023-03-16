import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { EDia, ETipoProfesor, ETurno } from '../entities/horario-x-curso.entity';
// import { EDia, ETipoProfesor, ETurno } from 'src/horarios/entities/horario.entity';

export class CreateHorarioXCursoDto {
  @IsNotEmpty()
  @IsMongoId()
  materia: string;

  @IsNotEmpty()
  @IsMongoId()
  curso: string;

  // @IsNotEmpty()
  // @IsMongoId()
  // horario: string;

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
  @IsEnum(ETurno)
  @ApiProperty({
    description: 'Turno',
    example: 'Turno mañana, Turno tarde, prehora,etc',
  })
  readonly turno: ETurno;

  @IsNotEmpty()
  @IsEnum(ETipoProfesor)
  @ApiProperty({ description: 'Tipo de profesor' })
  readonly tipoProfesor: ETipoProfesor;
}

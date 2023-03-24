import {
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { EDia, ETipoProfesor, ETurno } from '..//horario-x-curso/entities/horario-x-curso.entity';
import { EDia , ETipoProfesor, ETurno} from '../../horario-x-curso/entities/horario-x-curso.entity';
// import { EDia, ETipoProfesor, ETurno } from '../entities/horario.entity';

export class CreateHorarioDto {
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

export class UpdateHorarioDto extends PartialType(CreateHorarioDto) {}

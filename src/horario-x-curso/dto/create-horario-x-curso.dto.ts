import { IsNotEmpty, IsEnum, IsMongoId, IsNumber, IsPositive, Min, Max, ValidateNested, ArrayMinSize, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EDia, ETipoProfesor } from '../entities/horario-x-curso.entity';

// Crea un nuevo DTO para representar el objeto que contiene el profesor y el tipo de profesor
class ProfesorTipoDto {
  @IsNotEmpty({message: 'El profesor no puede estar vacio'})
  @IsMongoId({message: 'El profesor debe ser un id de mongo'})
  @ApiProperty({ description: 'Profesor' })
  readonly profesor: string;

  @IsNotEmpty({message: 'El tipo de profesor no puede estar vacio'})
  @IsEnum(ETipoProfesor)
  @ApiProperty({ description: 'Tipo de profesor' })
  readonly tipoProfesor: ETipoProfesor;
}

export class CreateHorarioXCursoDto {
  @IsNotEmpty({message: 'La materia no puede estar vacia'})
  @IsMongoId({message: 'La materia debe ser un id de mongo'})
  materia: string;

  @IsNotEmpty({message: 'El curso no puede estar vacio'})
  @IsMongoId({message: 'El curso debe ser un id de mongo'})
  curso: string;

  @IsNotEmpty({ message: 'El modulo no puede estar vacío' })
  @IsNumber({},{ message: 'El modulo debe ser un numero' })
  @IsPositive({ message: 'El modulo debe ser positivo'})
  @Min(1, {message: 'El modulo debe ser mayor o igual a 1'})
  @Max(6, {message: 'El modulo debe ser menor o igual a 6'})
  @ApiProperty({ description: 'Modulo' })
  readonly modulo: number;

  @IsNotEmpty({ message: 'El dia no puede estar vacío' })
  @IsEnum(EDia, {message: 'El dia debe ser Lunes, Martes, Miercoles, Jueves o Viernes'})
  @ApiProperty({ description: 'Dia de la semana' })
  readonly dia: EDia;

  // Agrega el campo opcional arrayProfesores
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'Debes agregar al menos un profesor al horario'})
  @Type(() => ProfesorTipoDto)
  @ApiProperty({ description: 'Array de profesores y sus tipos', type: [ProfesorTipoDto], required: false })
  readonly arrayProfesores: ProfesorTipoDto[];
}

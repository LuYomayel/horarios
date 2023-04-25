import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoDto } from './create-curso.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min,IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCursoDto {
    @IsString()
    notas: string;
//   @IsNotEmpty()
//   @IsNumber()
//   @IsPositive()
//   @Min(1)
//   @Max(6)
//   @ApiProperty({ description: 'Año del curso' })
//   readonly anio: number;

//   @IsNotEmpty()
//   @IsNumber()
//   @IsPositive()
//   @Min(1)
//   @Max(6)
//   readonly division: number;

//   @IsNotEmpty()
//   @IsEnum(ETurno)
//   @IsArray()
//   @ApiProperty({
//     description: 'Turno',
//     example: 'Turno mañana, Turno tarde, prehora,etc',
//   })
//   readonly turno: ETurno;
}

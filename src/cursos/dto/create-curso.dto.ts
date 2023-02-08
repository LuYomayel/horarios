import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

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
}

import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfesoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Nombre` })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Apellido` })
  readonly apellido: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  // @isIdentityCard('es-AR')
  @ApiProperty({ description: `Dni` })
  readonly dni: number;
}

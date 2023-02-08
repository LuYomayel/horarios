import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateHorarioXCursoDto {
  @IsNotEmpty()
  @IsMongoId()
  materia: string;

  @IsNotEmpty()
  @IsMongoId()
  curso: string;

  @IsNotEmpty()
  @IsMongoId()
  horario: string;

  @IsNotEmpty()
  @IsMongoId()
  profesor: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioXCursoDto } from './create-horario-x-curso.dto';

export class UpdateHorarioXCursoDto extends PartialType(CreateHorarioXCursoDto) {}

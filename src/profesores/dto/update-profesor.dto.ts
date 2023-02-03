import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesoreDto } from './create-profesor.dto';

export class UpdateProfesoreDto extends PartialType(CreateProfesoreDto) {}

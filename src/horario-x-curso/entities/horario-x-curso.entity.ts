import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Curso } from '../../cursos/entities/curso.entity';
import { Horario } from '../../horarios/entities/horario.entity';
import { Profesor } from '../../profesores/entities/profesor.entity';
import { Materia } from '../../materias/entities/materia.entity';

@Schema()
export class HorarioXCurso extends Document {
  @Prop({ type: Types.ObjectId, ref: Materia.name })
  materia: Materia | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Profesor.name })
  profesor: Profesor | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Curso.name })
  curso: Curso | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Horario.name })
  horario: Horario | Types.ObjectId;
}

export const HorarioXCursoSchema = SchemaFactory.createForClass(HorarioXCurso);

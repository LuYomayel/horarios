import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
@Schema()
export class Curso extends Document {
  @Prop({ required: true })
  anio: number;

  @Prop({ required: true })
  division: string;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

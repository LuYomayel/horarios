import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ETurno } from '../../horario-x-curso/entities/horario-x-curso.entity';
@Schema()
export class Curso extends Document {
  _id: string;

  @Prop({ required: true })
  anio: number;

  @Prop({ required: true })
  division: number;

  @Prop({ required: false })
  notas: string;

  @Prop({ required: true })
  turno: ETurno[];
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

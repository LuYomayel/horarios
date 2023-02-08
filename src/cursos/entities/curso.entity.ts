import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Curso extends Document {
  _id: string;

  @Prop({ required: true })
  anio: number;

  @Prop({ required: true })
  division: number;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);

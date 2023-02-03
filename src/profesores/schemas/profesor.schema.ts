import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Materia } from '../../schemas/materia.schema';
import * as mongoose from 'mongoose';
export type ProfesorDocument = HydratedDocument<Profesor>;

@Schema()
export class Profesor {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  dni: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }],
    required: false,
  })
  materia: Materia[];
}

export const ProfesorSchema = SchemaFactory.createForClass(Profesor);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type MateriaDocument = HydratedDocument<Materia>;

@Schema()
export class Materia {
  @Prop()
  nombre: string;
}

export const MateriaSchema = SchemaFactory.createForClass(Materia);

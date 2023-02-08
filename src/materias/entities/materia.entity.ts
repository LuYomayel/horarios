import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Materia extends Document {
  nombre: string;
}

export const MateriaSchema = SchemaFactory.createForClass(Materia);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProfesor } from '../../interfaces';
@Schema()
export class Profesor extends Document implements IProfesor {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  dni: number;
}

export const ProfesorSchema = SchemaFactory.createForClass(Profesor);

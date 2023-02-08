import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Horario, HorarioSchema } from '../../horarios/entities/horario.entity';
import { Materia, MateriaSchema } from '../../materias/entities/materia.entity';
@Schema()
export class Profesor extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  dni: number;
}

export const ProfesorSchema = SchemaFactory.createForClass(Profesor);

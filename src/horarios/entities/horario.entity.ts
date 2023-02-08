import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Materia } from '../../materias/entities/materia.entity';
import { Profesor } from '../../profesores/entities/profesor.entity';

export enum ETurno {
  mañana = 'Mañana',
  tarde = 'Tarde',
  prehora = 'Prehora',
  noche = 'Noche',
}

export enum EDia {
  lunes = 'Lunes',
  martes = 'Martes',
  miercoles = 'Miercoles',
  jueves = 'Jueves',
  viernes = 'Vienes',
}

export enum ETipoProfesor {
  titular = 'Titular',
  suplente = 'Suplente',
  provisional = 'Provisional',
}

@Schema()
export class Horario extends Document {
  @Prop({ required: true })
  modulo: number;

  @Prop({ required: true })
  turno: ETurno;

  @Prop({ required: true })
  dia: EDia;

  @Prop({ required: true })
  tipoProfesor: ETipoProfesor;
}

export const HorarioSchema = SchemaFactory.createForClass(Horario);

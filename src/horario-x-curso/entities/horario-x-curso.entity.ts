import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Curso } from '../../cursos/entities/curso.entity';
// import { EDia, ETipoProfesor, ETurno, Horario } from '../../horarios/entities/horario.entity';
import { Profesor } from '../../profesores/entities/profesor.entity';
import { Materia } from '../../materias/entities/materia.entity';

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
  titular_interino = 'Titular Interino'
}

export enum ETurnoManana{
  MODULO_1 = '7:30-8:30',
  MODULO_2 = '8:30-9:30',
  MODULO_3 = '9:50-10:50',
  MODULO_4 = '10:50-11:50',
  MODULO_5 = '11:50-12:50',
}
export enum ETurnoTarde{
  MODULO_1 = '12:50-13:50',
  MODULO_2 = '13:50-14:50',
  MODULO_3 = '15:10-16:10',
  MODULO_4 = '16:10-17:10',
  MODULO_5 = '17:10-18:10',
  MODULO_PREHORA = 'Prehora'
}

@Schema()
export class HorarioXCurso extends Document {
  @Prop({ type: Types.ObjectId, ref: Materia.name })
  materia: Materia | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Profesor.name })
  profesor: Profesor | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Curso.name })
  curso: Curso | Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: Horario.name })
  // horario: Horario | Types.ObjectId;
  @Prop({ required: true })
  modulo: number;

  @Prop({ required: true })
  dia: EDia;

  @Prop({ required: false })
  tipoProfesor: ETipoProfesor;

  @Prop({ required: false })
  arrayProfesores?: {
    profesor: Profesor;
    tipoProfesor: ETipoProfesor
  }[]
}

export const HorarioXCursoSchema = SchemaFactory.createForClass(HorarioXCurso);

HorarioXCursoSchema.set('toObject', { virtuals: true });

HorarioXCursoSchema.virtual('arrayProfesores.profesor', {
  ref: Profesor.name,
  localField: 'arrayProfesores.profesor',
  foreignField: '_id',
  justOne: true,
});
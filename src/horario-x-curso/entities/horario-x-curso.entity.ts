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
  turno: ETurno;

  @Prop({ required: true })
  dia: EDia;

  @Prop({ required: false })
  tipoProfesor: ETipoProfesor;
}

export const HorarioXCursoSchema = SchemaFactory.createForClass(HorarioXCurso);

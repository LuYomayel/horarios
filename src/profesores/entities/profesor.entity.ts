import { Materia } from 'src/materias/entities/materia.entity';

export class Profesor {
  _id: string;
  nombre: string;
  apellido: string;
  materia: Materia[];
}

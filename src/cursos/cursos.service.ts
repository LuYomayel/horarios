import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EDia, ETurno, HorarioXCurso } from '../horario-x-curso/entities/horario-x-curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<Curso>,
    @InjectModel(HorarioXCurso.name) private horarioXCursoModel: Model<HorarioXCurso>,
  ) {}
  async create(createCursoDto: CreateCursoDto) {
    const newCurso = await new this.cursoModel(createCursoDto);
    return newCurso.save();
  }

  async findAll() {
    return await this.cursoModel.find().select({_v:0}).exec();
  }

  async findOne(_id: string) {
    return await this.cursoModel.findOne( { _id } ).exec();
  }

  async findByAnioAndDivision(anio: number, division: number) {
    const curso = await this.cursoModel.findOne({ anio, division });
    if (!curso) return { _id: '' };
    return curso;
  }

  async findByTurno(_id:string ,turno: ETurno){
    const cursosManana = await this.cursoModel.find( { turno: { $in: [turno] } } ).exec();
    return await this.horarioXCursoModel
    // .find({ 'arrayProfesores.profesor': new mongoose.Types.ObjectId(_id), curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .find({ 'arrayProfesores.profesor':_id, curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .populate('materia')
    .populate('curso')
    .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
    .exec();
  }

  async findByCurso(anio: number, division: number) {
    const { _id } = await this.findByAnioAndDivision(
      anio,
      division,
    );
    if (!_id) return [];
    return await this.horarioXCursoModel
      .find({ curso: _id.toString() })
      .populate('materia')
      // .populate('profesor')
      .populate('curso')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
      .exec();
  }

  async findHorario(_id: string, dia: EDia, modulo: number) {
    const cursosManana = await this.findOne(_id);
    console.log('ID CURSO: ', _id)
    console.log('CURSO: ', cursosManana)
    const curso = await this.horarioXCursoModel
    .findOne({
      modulo: modulo,
      dia: dia,
      curso: cursosManana.id
    })
    .exec();
    
    if(curso) throw new NotFoundException('Este curso ya tiene ese horario asignado.');
    else return false;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    return await this.cursoModel.findOneAndUpdate({_id: id}, updateCursoDto)
  }

  async remove(id: string) {
    const cursoEncontrado = await  this.horarioXCursoModel
    .findOne({ 'curso': id })
    .exec();
    if(cursoEncontrado) throw new NotFoundException('Este curso tiene horarios asignados. No se puede eliminar');
    return this.cursoModel.findOneAndRemove({_id:id})
  }
}

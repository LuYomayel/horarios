import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ETurno } from '../horario-x-curso/entities/horario-x-curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<Curso>,
    @InjectConnection() private connection: Connection,
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

  async findByTurno( turno: ETurno){
    const cursos = await this.cursoModel.find( { turno: { $in: [turno] } } ).exec();
    return cursos;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    return await this.cursoModel.findOneAndUpdate({_id: id}, updateCursoDto)
  }

  async remove(id: string) {
    return await this.cursoModel.findOneAndDelete({_id:id}).exec();
  }
}

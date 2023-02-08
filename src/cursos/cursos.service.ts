import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
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
    return await this.cursoModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  async findByAnioAndDivision(anio: number, division: number) {
    const curso = await this.cursoModel.findOne({ anio, division });
    if (!curso) return { _id: '' };
    return curso;
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return `This action updates a #${id} curso`;
  }

  remove(id: number) {
    return `This action removes a #${id} curso`;
  }
}

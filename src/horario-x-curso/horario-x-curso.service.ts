import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from '../cursos/cursos.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { HorarioXCurso } from './entities/horario-x-curso.entity';

@Injectable()
export class HorarioXCursoService {
  constructor(
    @InjectModel(HorarioXCurso.name)
    private horarioXCursoModel: Model<HorarioXCurso>,
    @InjectConnection() private connection: Connection,
    private cursoService: CursosService,
  ) {}
  async create(createHorarioXCursoDto: CreateHorarioXCursoDto) {
    const newHorarioXCurso = await new this.horarioXCursoModel(
      createHorarioXCursoDto,
    );
    return newHorarioXCurso.save();
  }

  async findAll() {
    return await this.horarioXCursoModel
      .find()
      .populate(['materia', 'profesor', 'curso', 'horario'])
      .exec();
  }

  async findByCurso(anio: number, division: number) {
    const { _id } = await this.cursoService.findByAnioAndDivision(
      anio,
      division,
    );
    if (!_id) return [];
    return await this.horarioXCursoModel
      .find({ curso: _id.toString() })
      .populate(['materia', 'profesor', 'horario'])
      .exec();
  }

  async findByProfesor(_id: string) {
    return await this.horarioXCursoModel
      .find({ profesor: _id.toString() })
      .populate(['curso', 'materia', 'horario'])
      .exec();
  }

  update(id: number, updateHorarioXCursoDto: UpdateHorarioXCursoDto) {
    return `This action updates a #${id} horarioXCurso`;
  }

  remove(id: number) {
    return `This action removes a #${id} horarioXCurso`;
  }
}

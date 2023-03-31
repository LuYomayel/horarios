import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from '../cursos/cursos.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { ETurno, HorarioXCurso } from './entities/horario-x-curso.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class HorarioXCursoService {
  constructor(
    @InjectModel(HorarioXCurso.name)
    private horarioXCursoModel: Model<HorarioXCurso>,
    @InjectConnection() private connection: Connection,
    private cursoService: CursosService,
  ) {}
  async create(createHorarioXCursoDto: CreateHorarioXCursoDto) {
    console.log('DTO: ', createHorarioXCursoDto)
    const cursosManana = await this.cursoService.findOne(createHorarioXCursoDto.curso);
    const curso = await this.horarioXCursoModel
    .findOne({
      modulo: createHorarioXCursoDto.modulo,
      dia: createHorarioXCursoDto.dia,
      curso: cursosManana
    })
    // .populate({
    //   path: 'curso',
    //   match: { _id: createHorarioXCursoDto.curso },
    //   select: '_id'
    // })
    .exec();
    if(curso) throw new NotFoundException('Este curso ya tiene ese horario asignado.');
    const newHorarioXCurso = await new this.horarioXCursoModel(
      createHorarioXCursoDto,
    );
    console.log('new curso: ', newHorarioXCurso)
    return newHorarioXCurso.save();
  }

  async findAll() {
    return await this.horarioXCursoModel
      .find()
      .populate(['materia', 'profesor', 'curso'])
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
      .populate(['materia', 'profesor', 'curso'])
      .exec();
  }

  async findByProfesor(_id: string, turno: ETurno) {

    const cursosManana = await this.cursoService.findByTurno(turno);
    console.log('Cursos: ', cursosManana)

    return await this.horarioXCursoModel
      .find({ profesor: _id, curso: { $in: cursosManana.map(curso => curso._id.toString()) }})
      .populate('materia')
      .populate('profesor')
      .populate('curso')
      .exec();
  }

  update(id: number, updateHorarioXCursoDto: UpdateHorarioXCursoDto) {
    return `This action updates a #${id} horarioXCurso`;
  }

  remove(id: number) {
    return `This action removes a #${id} horarioXCurso`;
  }
}

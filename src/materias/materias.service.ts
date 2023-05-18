import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';
import { HorarioXCurso } from '../horario-x-curso/entities/horario-x-curso.entity';

@Injectable()
export class MateriasService {
  constructor(
    @InjectModel(Materia.name) private materiaModel: Model<Materia>,
    @InjectModel(HorarioXCurso.name) private horarioXCursoModel: Model<HorarioXCurso>,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(createMateriaDto: CreateMateriaDto) {
    const newMateria = await new this.materiaModel(createMateriaDto);
    return newMateria.save();
  }

  async findAll() {
    return await this.materiaModel.find().select({ _id: 1, nombre: 1 }).exec();
  }
  

  findOne(id: number) {
    return `This action returns a #${id} materia`;
  }

  async update(id: string, updateMateriaDto: UpdateMateriaDto) {
    return this.materiaModel.findOneAndUpdate({_id: id}, updateMateriaDto)
  }

  async remove(id: string) {
    const materiaEncontrada = await  this.horarioXCursoModel
    // .find({ 'arrayProfesores.profesor': new mongoose.Types.ObjectId(_id), curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .findOne({ 'materia': id })
    .populate('materia')
    .populate('curso')
    .exec();
    if(materiaEncontrada) throw new NotFoundException('Esta materia tiene horarios asignados. No se puede eliminar');
    return this.materiaModel.findOneAndRemove({_id:id})
  }
}

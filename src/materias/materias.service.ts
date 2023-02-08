import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';

@Injectable()
export class MateriasService {
  constructor(
    @InjectModel(Materia.name) private materiaModel: Model<Materia>,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(createMateriaDto: CreateMateriaDto) {
    const newMateria = await new this.materiaModel(createMateriaDto);
    return newMateria.save();
  }

  async findAll() {
    return await this.materiaModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} materia`;
  }

  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return `This action updates a #${id} materia`;
  }

  remove(id: number) {
    return `This action removes a #${id} materia`;
  }
}

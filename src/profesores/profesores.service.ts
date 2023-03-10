import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';

import { Profesor } from './entities/profesor.entity';
import { CreateProfesoreDto } from './dto/create-profesor.dto';
import { UpdateProfesoreDto } from './dto/update-profesor.dto';
import { FilterProfesorDto } from './dto/filter-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectModel(Profesor.name) private profesorModel: Model<Profesor>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createProfesoreDto: CreateProfesoreDto): Promise<Profesor> {
    const newProfesor = new this.profesorModel(createProfesoreDto);
    return newProfesor.save();
  }

  async findAll(params?: FilterProfesorDto): Promise<Profesor[]> {
    if (params.limit || params.offset) {
      const filters: FilterQuery<Profesor> = {};
      const { limit, offset } = params;
      return await this.profesorModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .exec();
    }

    return await this.profesorModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} profesore`;
  }

  update(id: number, updateProfesoreDto: UpdateProfesoreDto) {
    return `This action updates a #${id} profesore`;
  }

  remove(id: number) {
    return `This action removes a #${id} profesore`;
  }
}

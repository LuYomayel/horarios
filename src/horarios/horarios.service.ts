import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectModel(Horario.name) private horarioModel: Model<Horario>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createHorarioDto: CreateHorarioDto) {
    const newHorario = new this.horarioModel(createHorarioDto);
    return await newHorario.save();
  }

  async findAll() {
    return await this.horarioModel.find().exec();
  }

  async findOne(modulo: number, turno: string, dia: string) {
    return await this.horarioModel
      .findOne({ modulo, turno, dia })
      .exec();
  }

  update(id: number, updateHorarioDto: UpdateHorarioDto) {
    return `This action updates a #${id} horario`;
  }

  remove(id: number) {
    return `This action removes a #${id} horario`;
  }
}

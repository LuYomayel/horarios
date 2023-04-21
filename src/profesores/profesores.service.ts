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

  // async create(){
  //   const nombresProfesores = [
  //     'JUNCOS EMILIANO',
  //     'COSTA MARIA',
  //     'ZICHERT CRISTINA',
  //     'MANINI FERNANDA',
  //     'MACIEL JOSÉ',
  //     'MARTINA MATIAS',
  //     'JUNCOS EMILIANO'
  //   ];
  //   const nombresProfesoresUnicos = [...new Set(nombresProfesores)];
  //   const profesores = nombresProfesoresUnicos.map(profe => 
  //     {
  //     return {
  //       nombre: profe.split(' ')[1],
  //       apellido: profe.split(' ')[0],
  //       dni: 1234
  //     }
  //   })
  //   console.log(profesores)
  //   profesores.forEach(async (profe) => {
  //     const profesor = new this.profesorModel(profe);
  //     console.log('Profesor; ', profesor)
  //     await profesor.save((error, documento) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log(`Se insertó el profesor ${documento.nombre}`);
  //       }
  //     });
  //   });
  // }

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

  async findOne(id: string) {
    return await this.profesorModel.find({_id: id}).exec();
  }

  update(id: number, updateProfesoreDto: UpdateProfesoreDto) {
    return `This action updates a #${id} profesore`;
  }

  remove(id: number) {
    return `This action removes a #${id} profesore`;
  }
}

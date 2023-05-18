import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';

import { Profesor } from './entities/profesor.entity';
import { CreateProfesoreDto } from './dto/create-profesor.dto';
import { UpdateProfesoreDto } from './dto/update-profesor.dto';
import { FilterProfesorDto } from './dto/filter-profesor.dto';
import { EDia, ETipoProfesor, ETurno, HorarioXCurso } from '../horario-x-curso/entities/horario-x-curso.entity';

import { Workbook } from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectModel(Profesor.name) private profesorModel: Model<Profesor>,
    @InjectModel(HorarioXCurso.name) private horarioXCursoModel: Model<HorarioXCurso>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createProfesoreDto: CreateProfesoreDto): Promise<Profesor> {
    const { cuil } = createProfesoreDto;
    const user = await this.profesorModel.findOne( { cuil } ).exec();
    if(user) throw new NotFoundException('Ya existe un profesor con este cuil.');
    const newProfesor = new this.profesorModel(createProfesoreDto);
    return await newProfesor.save();
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
        .select({_v:0})
        .exec();
    }

    return await this.profesorModel.find().select({_v:0}).exec();
  }

  async findOne(id: string) {
    return await this.profesorModel.find({_id: id}).exec();
  }

  async findHorario(_id: string, idCurso: string, modulo: number, dia: EDia) {
    const profesorEncontrado = await this.horarioXCursoModel.findOne({ curso: idCurso, modulo, dia, 'arrayProfesores.profesor': _id }).exec();
    console.log('Entre', dia, idCurso, modulo, _id)
    if(profesorEncontrado) throw new NotFoundException('El profesor ya tiene un horario asignado en este turno y módulo');
    else return false;
  }

  async update(id: string, updateProfesoreDto: UpdateProfesoreDto) {
    const profesor = await this.profesorModel.findOneAndUpdate({_id:id}, updateProfesoreDto).exec();
    return profesor;
  }

  async remove(id: string) {
    const profesorEncontrado = await  this.horarioXCursoModel
    // .find({ 'arrayProfesores.profesor': new mongoose.Types.ObjectId(_id), curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .findOne({ 'arrayProfesores.profesor': id })
    .populate('materia')
    .populate('curso')
    .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
    .exec();
    if(profesorEncontrado) throw new NotFoundException('Este profesor tiene horarios asignados. No se puede eliminar');
    return await this.profesorModel.deleteOne({_id:id})
  }

  async exportarProfesores(){
    try {
      const profesores = await this.profesorModel.find().exec();

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Profesores');

      worksheet.columns = [
        { header: 'Apellido', key: 'apellido', width: 20 },
        { header: 'Nombre', key: 'nombre', width: 20 },
      ];
      const profesoresOrdenados = profesores.sort((a, b) => a.apellido.localeCompare(b.apellido));
      profesoresOrdenados.forEach((profesor) => {
        worksheet.addRow({
          nombre: profesor.nombre,
          apellido: profesor.apellido,
        });
      });

      const excelBuffer = await workbook.xlsx.writeBuffer();
      
      return excelBuffer;
    } catch (error) {
      console.error(error);
      throw new Error('Error al exportar los profesores a Excel');
    }
    
  }

  async exportarProfesoresTipo(tipoProfesor: ETipoProfesor){
    try {
      const profesoresEncontrados = await this.horarioXCursoModel.find({ 'arrayProfesores.tipoProfesor':tipoProfesor })
        .populate('materia')
        .populate('curso')
        .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
        .exec();
      console.log('Profesores encontrados: ', profesoresEncontrados)
      
      const arrayProfesores = [];
      profesoresEncontrados.forEach((horario:any) => {
        const profe = arrayProfesores.some( hora => hora.curso.id === horario.curso.id && hora.materia.id === horario.materia.id);
        
        if(!profe){
          arrayProfesores.push({ 
            curso: horario.curso, 
            materia: horario.materia, 
            arrayProfesores: horario.arrayProfesores.filter((profe:any) => profe.tipoProfesor === tipoProfesor) })
        }
      })
      // return profesoresEncontrados;
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Profesores');

      worksheet.columns = [
        { header: 'Apellido', key: 'apellido', width: 20 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Curso', key: 'curso', width: 20 },
        { header: 'Materia', key: 'materia', width: 20 },
        { header: 'Situacion De Revista', key: 'tipoProfesor', width: 20 },
      ];
      // const profesoresOrdenados = profesores.sort((a, b) => a.apellido.localeCompare(b.apellido));
      arrayProfesores.forEach((horario:any) => {
        horario.arrayProfesores.forEach((profe, index) => {
          if(profe.tipoProfesor === tipoProfesor)
          worksheet.addRow({
            nombre: horario.arrayProfesores[index].profesor.nombre,
            apellido: horario.arrayProfesores[index].profesor.apellido,
            curso: `${horario.curso.anio}° ${horario.curso.division}°`,
            materia: horario.materia.nombre,
            tipoProfesor: horario.arrayProfesores[index].tipoProfesor,
          });
        });
      });

      const excelBuffer = await workbook.xlsx.writeBuffer();
      
      return excelBuffer;
    } catch (error) {
      console.error(error);
      throw new Error('Error al exportar los profesores a Excel');
    }
  }
}

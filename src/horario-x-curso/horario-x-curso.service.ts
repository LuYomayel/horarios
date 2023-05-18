import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from '../cursos/cursos.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { EDia, ETipoProfesor, ETurno, ETurnoManana, ETurnoTarde, HorarioXCurso } from './entities/horario-x-curso.entity';
import { NotFoundException } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { IDTOpdf } from './dto/pdf-cursos.dto';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import mongoose from 'mongoose';

@Injectable()
export class HorarioXCursoService {
  constructor(
    @InjectModel(HorarioXCurso.name)
    private horarioXCursoModel: Model<HorarioXCurso>,
    @InjectConnection() private connection: Connection,
    private cursoService: CursosService,
  ) {}
  async create(createHorarioXCursoDto: CreateHorarioXCursoDto) {
    // console.log('DTO: ', createHorarioXCursoDto)
    const cursosManana = await this.cursoService.findOne(createHorarioXCursoDto.curso);
    const curso = await this.horarioXCursoModel
    .findOne({
      modulo: createHorarioXCursoDto.modulo,
      dia: createHorarioXCursoDto.dia,
      curso: cursosManana.id
    })
    .exec();
    console.log('Curso encontrado: ', curso)
    if(curso) throw new NotFoundException('Este curso ya tiene ese horario asignado.');

    
    const newHorarioXCurso = await new this.horarioXCursoModel(
      createHorarioXCursoDto,
    );
    return newHorarioXCurso.save();
  }

  async findAll() {

    // const horarios = await this.horarioXCursoModel
    // .find()
    // .exec();
    
    // const mapeados = horarios.map( result => { return {tipoProfesor: result.tipoProfesor, profesor: result.profesor, id: result.id} })
    // horarios.forEach( async (result) => {
    //   mapeados.forEach( maped => {
    //     if(maped.id == result.id){
    //       result.arrayProfesores = [{tipoProfesor: maped.tipoProfesor, profesor: maped.profesor.toString() }]
    //     }
    //   })
    //   const hola = await this.horarioXCursoModel.findByIdAndUpdate(result.id, result)
    //   console.log('Hola: ', hola)
    // })
    // console.log('Horarios: ', horarios)

    

    return await this.horarioXCursoModel
      .find()
      .populate('materia')
      .populate('profesor')
      .populate('curso')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
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
      .populate('materia')
      // .populate('profesor')
      .populate('curso')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
      .exec();
  }

  async findByProfesor(_id: string, turno: ETurno) {
    const cursosManana = await this.cursoService.findByTurno(turno);
    
    return await this.horarioXCursoModel
    // .find({ 'arrayProfesores.profesor': new mongoose.Types.ObjectId(_id), curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .find({ 'arrayProfesores.profesor':_id, curso: { $in: cursosManana.map(curso => curso._id.toString()) } })
    .populate('materia')
    .populate('curso')
    .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
    .exec();
  }
  
  
  
  

  async update(updateHorarioXCursoDto: UpdateHorarioXCursoDto) {
    
    const horarioCurso = await this.horarioXCursoModel.findById(updateHorarioXCursoDto._id);
    if(!horarioCurso) throw new NotFoundException('Horario no encontrado.');
    return await this.horarioXCursoModel.findByIdAndUpdate(updateHorarioXCursoDto._id, updateHorarioXCursoDto)
  }

  async getByID(id: string) {
    return await this.horarioXCursoModel.findOne({_id: id})
      .select('arrayProfesores')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
      .exec();
  }
  

  async generarCalendario(horarios : IDTOpdf): Promise<Buffer> {
    const templatePath = path.join(__dirname, '../templates/calendario.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);
    handlebars.registerHelper('range', function (start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    });

    
    
    handlebars.registerHelper('eachIndex', function (array, options) {
      let result = '';
      for (let i = 0; i < array[0].hours.length; i++) {
        result += options.fn(array[i], { data: { index: i } });
      }
      // console.log('Result: ', result)
      return result;
    });

    handlebars.registerHelper('getCssClassForProfesor', function (tipoProfesor) {
      // console.log('Tipo profe: ', tipoProfesor)
      switch (tipoProfesor) {
        case 'T':
          return 'titular';
        case 'TI':
          return 'titular-interino';
        case 'P':
          return 'provisional';
        case 'S':
          return 'suplente';
        default:
          return '';
      }
    });
    // console.log('Horarios: ', horarios)
    const html = template({ schedule: horarios.schedule, horarios: horarios.horarios, curso: horarios.curso, turno: horarios.turno, notas: horarios.notas });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: true, printBackground: true });
    await browser.close();

    return pdfBuffer;
  }

  transformData(data, tipoHorario: string): IDTOpdf {
    const notas = data[0].curso.notas || '';
    let curso: (string |undefined) = undefined;
    let profesor: (string |undefined) = undefined;
    if(tipoHorario == 'profesor'){
      const masFrecuente = this.masFrecuente(data);
      profesor = `${masFrecuente.apellido}, ${masFrecuente.nombre}`;
      // profesor = this.masFrecuente(data);
    }
    if(tipoHorario == 'curso'){
      curso = `${data[0].curso.anio}° ${data[0].curso.division}°`;
      
    }
    console.log( 'Profesor: ', profesor)
    console.log( 'curso: ', curso)


    const days = [EDia.lunes, EDia.martes, EDia.miercoles, EDia.jueves, EDia.viernes];
    const turno = data[0].curso.turno.includes(ETurno.mañana) ? ETurno.mañana : ETurno.tarde;
    const result = days.map(day => {
      const dayData = data.filter(item => item.dia === day);
      const cantHoras = turno == ETurno.mañana ? 5 : 6;
      const hours = Array.from({ length: cantHoras }, (_, i) => i + 1).map(hour => {
        const hourData = dayData.find(item => item.modulo === hour);
        if (hourData) {
          const profesores = hourData.arrayProfesores.map(profesorItem => {
            return `${this.getTipoProfesor(profesorItem.tipoProfesor)}: ${profesorItem.profesor.nombre} ${profesorItem.profesor.apellido}`;
          }).join('<br>');
          // console.log('css class:', this.getCssClassForProfesor(hourData.arrayProfesores[0].tipoProfesor), profesores);
          return {
            materia: `${hourData.materia.nombre} <br>`,
            profesor: profesores,
            tipoProfesor: hourData.tipoProfesor,
            cssClass: this.getCssClassForProfesor(hourData.arrayProfesores[0].tipoProfesor)
          };
        }
        return {
          materia: '',
          profesor: '',
          tipoProfesor: '',
          cssClass: ''
        };
      });
      if(turno == ETurno.tarde){
        const ultElemento = hours.pop();
        hours.unshift(ultElemento);
      }
      return { day, hours };
    });
    const horarioFinal = { 
      horarios: this.tardeManiana(turno), 
      schedule: result, 
      turno, 
      curso, 
      notas,
      profesorElegido: profesor
    }
  
    console.log('horario final: ', horarioFinal)
    return horarioFinal;
  }
  
  async delete(id: string) {
    const me = this;
    const eliminado = await me.horarioXCursoModel.deleteOne({_id: id}).exec();
    console.log('Eliminado: ', eliminado)
    return eliminado;
  }

  getCssClassForProfesor(tipoProfesor: ETipoProfesor) {
    // console.log('Tipo profe: ', tipoProfesor)
    switch(tipoProfesor){
      case ETipoProfesor.provisional:
        return 'provisional'; //verde
      case ETipoProfesor.titular:
        return 'titular'; //azul
      case ETipoProfesor.suplente:
        return 'suplente'; // rojo
      case ETipoProfesor.titular_interino:
        return 'titular-interino'; //amarillo
      default:
        console.log('Tipo profe error: ', tipoProfesor)
        return 'Error tipo Profe'
    }
  }
  
  tardeManiana(turno:ETurno) {
    if(turno === ETurno.mañana) return {
      0: ETurnoManana.MODULO_1,
      1: ETurnoManana.MODULO_2,
      2: ETurnoManana.MODULO_3,
      3: ETurnoManana.MODULO_4,
      4: ETurnoManana.MODULO_5,
    }
    else {
      return {
        0: ETurnoTarde.MODULO_PREHORA,
        1: ETurnoTarde.MODULO_1,
        2: ETurnoTarde.MODULO_2,
        3: ETurnoTarde.MODULO_3,
        4: ETurnoTarde.MODULO_4,
        5: ETurnoTarde.MODULO_5,
      }
    }
  }

  getTipoProfesor(string: ETipoProfesor){
    const me = this;
    switch(string){
      case ETipoProfesor.provisional:
        return 'P';
      case ETipoProfesor.titular:
        return 'T';
      case ETipoProfesor.suplente:
        return 'S';
      case ETipoProfesor.titular_interino:
        return 'TI';
      default:
        return 'Error tipo Profe'
    }
  }

  masFrecuente(data: any){
    let freqCount = {};

    // Contar la frecuencia de cada profesor
    for (let i = 0; i < data.length; i++) {
        let arrayProfesores = data[i].arrayProfesores;

        for (let j = 0; j < arrayProfesores.length; j++) {
            let profesorId = arrayProfesores[j].profesor.id; // Use the id as the key

            if (freqCount[profesorId]) {
                freqCount[profesorId]++;
            } else {
                freqCount[profesorId] = 1;
            }
        }
    }

    // Encontrar el profesor más frecuente
    let maxCount = 0;
    let mostFrequentProfesorId = null;
    for (let profesorId in freqCount) {
        if (freqCount[profesorId] > maxCount) {
            maxCount = freqCount[profesorId];
            mostFrequentProfesorId = profesorId;
        }
    }

    // Now you can find the most frequent professor in your data
    let mostFrequentProfesor = null;
    for (let i = 0; i < data.length; i++) {
        let arrayProfesores = data[i].arrayProfesores;

        for (let j = 0; j < arrayProfesores.length; j++) {
            if (arrayProfesores[j].profesor.id === mostFrequentProfesorId) {
                mostFrequentProfesor = arrayProfesores[j].profesor;
                break;
            }
        }

        if (mostFrequentProfesor) {
            break;
        }
    }

    // if (mostFrequentProfesor) {
    //     console.log('Profesor: ', mostFrequentProfesor.nombre, mostFrequentProfesor.apellido);
    // } else {
    //     console.log('No se encontró el profesor más frecuente');
    // }

    return mostFrequentProfesor;
  }
}
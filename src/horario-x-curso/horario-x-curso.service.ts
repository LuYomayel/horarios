import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from '../cursos/cursos.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { EDia, ETurno, ETurnoManana, ETurnoTarde, HorarioXCurso } from './entities/horario-x-curso.entity';
import { NotFoundException } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { IDTOpdf } from './dto/pdf-cursos.dto';
import { Profesor } from 'src/profesores/entities/profesor.entity';

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

    // const horarios = await this.horarioXCursoModel.find().populate(['materia', 'profesor', 'curso']);
    // const mapeados = horarios.map( result => { return {tipoProfesor: result.tipoProfesor, profesor: result.profesor._id, id: result.id} })
    // horarios.forEach( async (result) => {
    //   mapeados.forEach( maped => {
    //     if(maped.id == result.id){
    //       result.arrayProfesores = [{tipoProfesor: maped.tipoProfesor, profesor: maped.profesor}]
    //     }
    //   })
    //   await this.horarioXCursoModel.findByIdAndUpdate(result.id, result)
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
      .populate('profesor')
      .populate('curso')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
      .exec();
  }

  async findByProfesor(_id: string, turno: ETurno) {

    const cursosManana = await this.cursoService.findByTurno(turno);
    // console.log('Cursos: ', cursosManana)

    return await this.horarioXCursoModel
      .find({ profesor: _id, curso: { $in: cursosManana.map(curso => curso._id.toString()) }})
      .populate('materia')
      .populate('profesor')
      .populate('curso')
      .populate({ path: 'arrayProfesores.profesor', model: Profesor.name })
      .exec();
  }

  async update(updateHorarioXCursoDto: UpdateHorarioXCursoDto) {
    
    const horarioCurso = await this.horarioXCursoModel.findById(updateHorarioXCursoDto._id);
    if(!horarioCurso) throw new NotFoundException('Horario no encontrado.');
    return await this.horarioXCursoModel.findByIdAndUpdate(updateHorarioXCursoDto._id, updateHorarioXCursoDto)
  }

  remove(id: number) {
    return `This action removes a #${id} horarioXCurso`;
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
      return result;
    });
    const html = template({ schedule: horarios.schedule, horarios: horarios.horarios, curso: horarios.curso, turno: horarios.turno });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
    await browser.close();

    return pdfBuffer;
  }
  
  transformData(data): IDTOpdf {
    const days = [EDia.lunes, EDia.martes, EDia.miercoles, EDia.jueves, EDia.viernes];
    const turno = data[0].curso.turno.includes(ETurno.mañana) ? ETurno.mañana : ETurno.tarde;
    const result = days.map(day => {
      const dayData = data.filter(item => item.dia === day);
      const cantHoras = turno == ETurno.mañana ? 5 : 6;
      const hours = Array.from({ length: cantHoras }, (_, i) => i + 1).map(hour => {
        const hourData = dayData.find(item => item.modulo === hour);
        if (hourData) {
          return {
            materia: hourData.materia.nombre,
            profesor: `${hourData.profesor.nombre} ${hourData.profesor.apellido}`,
            tipoProfesor: hourData.tipoProfesor,
          };
        }
        return {
          materia: '',
          profesor: '',
          tipoProfesor: '',
        };
      });
      if(turno == ETurno.tarde){
        const ultElemento = hours.pop();
        hours.unshift(ultElemento);
      }
      return { day, hours };
    });
    // console.log('Turno: ', turno);
    const horarioFinal = { horarios: this.tardeManiana(turno), schedule: result, turno, curso: `${data[0].curso.anio}° ${data[0].curso.division}°` }

    console.log('horario final: ', horarioFinal)
    return horarioFinal;
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


}

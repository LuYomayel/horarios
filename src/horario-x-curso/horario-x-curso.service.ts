import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from '../cursos/cursos.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { ETurno, HorarioXCurso } from './entities/horario-x-curso.entity';
import { NotFoundException } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { IDTOpdf } from './dto/pdf-cursos.dto';

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
    // console.log('Cursos: ', cursosManana)

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
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
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
      0: '7:45-8:30',
      1: '8:30-9:30',
      2: '9:50-10:50',
      3: '10:50-11:50',
      4: '11:50-12:50'
    }
    else {
      return {
        0: 'Prehora',
        1: '12:50-13:50',
        2: '13:50-14:50',
        3: '15:10-16:10',
        4: '16:10-17:10',
        5: '17:10-18:10' 
      }
    }
  }


}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  ParseIntPipe,
  Res
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EDia, ETurno } from '../horario-x-curso/entities/horario-x-curso.entity';
import { Response } from 'express';
import { HorarioXCursoService } from '../horario-x-curso/horario-x-curso.service';

@UseGuards(JwtAuthGuard) 
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly cursosService: CursosService,
    private readonly horarioXCursoService: HorarioXCursoService,
  ) {}
  
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }
  
  // @Roles(ERoles.ADMIN)
  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get('horario-x-cursoExistente/:id/:dia/:modulo')
  horarioExistente(
    @Param('id') id: string,
    @Param('dia') dia: EDia,
    @Param('modulo') modulo: number
  ) {
    return this.cursosService.findHorario(id, dia, modulo);
  }

  @Get('findByTurno/:id/:turno')
  findByTurno(
    @Param('id') _id: string,
    @Param('turno') turno: ETurno
  ) {
    return this.cursosService.findByTurno(_id, turno);
  }

  @Get('findByCurso/:anio/:division')
  async findByCurso(
    @Param('anio', ParseIntPipe) anio: number,
    @Param('division') division: number,
  ) {
    const response = await this.cursosService.findByCurso(
      anio,
      division,
    );
    return response;
  }

  @Get('descargar-horario/curso/:anio/:division')
  async descargarHorarioCurso(
    @Res() res: Response,
    @Param('anio', ParseIntPipe) anio: number,
    @Param('division', ParseIntPipe) division: number,
  ) {
    const response = await this.findByCurso(
      anio,
      division,
    );
    
    const arrayHorarios = this.horarioXCursoService.transformData(response, 'curso');
    const pdfBuffer = await this.horarioXCursoService.generarCalendario(arrayHorarios);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=horario.pdf');
    res.send(pdfBuffer);
  }

  @Get('descargar-horario/profesor/:id/:turno')
  async descargarHorarioProfesor(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('turno') turno: ETurno,
  ) {
    const response = await this.findByTurno(
      id,
      turno,
    );
    
    const arrayHorarios = this.horarioXCursoService.transformData(response, 'profesor');
    const pdfBuffer = await this.horarioXCursoService.generarCalendario(arrayHorarios);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=horario.pdf');
    res.send(pdfBuffer);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}

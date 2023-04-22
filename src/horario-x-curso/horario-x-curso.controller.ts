import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Res,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HorarioXCursoService } from './horario-x-curso.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { ETurno, HorarioXCurso } from './entities/horario-x-curso.entity';
import { Roles } from '../auth/roles.decorator';
import { ERoles } from '../auth/entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

// @UseGuards(JwtAuthGuard) 
@Controller('horario-x-curso')
export class HorarioXCursoController {
  constructor(private readonly horarioXCursoService: HorarioXCursoService) {}

  @Roles(ERoles.ADMIN)
  @Post()
  async create(@Body() createHorarioXCursoDto: CreateHorarioXCursoDto) {
    try {
      return await this.horarioXCursoService.create(createHorarioXCursoDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  
  @Get()
  async findAll() {
    return await this.horarioXCursoService.findAll();
  }
  
  
  
  @Get('/curso/:anio/:division')
  async findByCurso(
    @Param('anio', ParseIntPipe) anio: number,
    @Param('division') division: number,
  ) {
    const response = await this.horarioXCursoService.findByCurso(
      anio,
      division,
    );
    return response;
  }

  @Get('/profesor/:_id/:turno')
  async findByProfesor
    (
      @Param('_id') _id: string,
      @Param('turno') turno:ETurno,
    ) {
    const response = await this.horarioXCursoService.findByProfesor(_id, turno);
    console.log('Response: ', response)
    return response;
  }

  @Put()
  update(
    // @Param('id') id: string,
    @Body() updateHorarioXCursoDto: UpdateHorarioXCursoDto,
  ) {
    return this.horarioXCursoService.update(updateHorarioXCursoDto);
  }

  @Get(':id')
  remove(@Param('id') id: string) {
    return this.horarioXCursoService.getByID(id);
  }

  @Get('descargar-horario/curso/:anio/:division')
  async descargarHorario(
    @Res() res: Response,
    @Param('anio', ParseIntPipe) anio: number,
    @Param('division') division: number,
  ) {
    const response = await this.horarioXCursoService.findByCurso(
      anio,
      division,
    );
    const arrayHorarios = this.horarioXCursoService.transformData(response);
    const pdfBuffer = await this.horarioXCursoService.generarCalendario(arrayHorarios);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=horario.pdf');
    res.send(pdfBuffer);
  }

  @Delete(':id')
  delete(@Param('id') id:string){
    return this.horarioXCursoService.delete(id);
  }
}

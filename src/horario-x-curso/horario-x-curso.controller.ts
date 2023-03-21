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
} from '@nestjs/common';
import { HorarioXCursoService } from './horario-x-curso.service';
import { CreateHorarioXCursoDto } from './dto/create-horario-x-curso.dto';
import { UpdateHorarioXCursoDto } from './dto/update-horario-x-curso.dto';
import { ETurno } from './entities/horario-x-curso.entity';

@Controller('horario-x-curso')
export class HorarioXCursoController {
  constructor(private readonly horarioXCursoService: HorarioXCursoService) {}

  @Post()
  async create(@Body() createHorarioXCursoDto: CreateHorarioXCursoDto) {
    return await this.horarioXCursoService.create(createHorarioXCursoDto);
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
    return response;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHorarioXCursoDto: UpdateHorarioXCursoDto,
  ) {
    return this.horarioXCursoService.update(+id, updateHorarioXCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horarioXCursoService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  async create(@Body() createHorarioDto: CreateHorarioDto) {
    return await this.horariosService.create(createHorarioDto);
  }

  @Get()
  async findAll() {
    return await this.horariosService.findAll();
  }

  @Get(':modulo/:turno/:dia')
  findOne(
    @Param('modulo') modulo: number,
    @Param('turno') turno: string,
    @Param('dia') dia: string
  ) {
    return this.horariosService.findOne(+modulo, turno, dia);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(+id, updateHorarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horariosService.remove(+id);
  }
}

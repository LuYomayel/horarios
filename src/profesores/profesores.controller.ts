import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesor.dto';
import { UpdateProfesoreDto } from './dto/update-profesor.dto';
import { FilterProfesorDto } from './dto/filter-profesor.dto';
import { Profesor } from './entities/profesor.entity';
@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  async create(@Body() createProfesoreDto: CreateProfesoreDto) {
    return await this.profesoresService.create(createProfesoreDto);
  }

  @Get()
  async findAll(@Query() params: FilterProfesorDto): Promise<Profesor[]> {
    return await this.profesoresService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesoresService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfesoreDto: UpdateProfesoreDto,
  ) {
    return this.profesoresService.update(+id, updateProfesoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesoresService.remove(+id);
  }
}

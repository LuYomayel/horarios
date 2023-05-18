import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Roles } from '../auth/roles.decorator';
import { ERoles } from 'src/auth/entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}
  
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }
  
  // @Roles(ERoles.ADMIN)
  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  // @Get('horario-x-cursoExistente/:id')
  // cursoExistente(@Param('id') id: string) {
  //   return this.cursosService.findOne(id);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}

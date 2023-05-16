import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Res,
} from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesor.dto';
import { UpdateProfesoreDto } from './dto/update-profesor.dto';
import { FilterProfesorDto } from './dto/filter-profesor.dto';
import { Profesor } from './entities/profesor.entity';

import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ERoles } from 'src/auth/entities/usuario.entity';
import { Response } from 'express';

// @UseGuards(JwtAuthGuard)
@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Roles(ERoles.ADMIN)
  @Post()
  // async create() {
  //   return await this.profesoresService.create();
  // }
  async create(@Body() createProfesoreDto: CreateProfesoreDto) {
    return await this.profesoresService.create(createProfesoreDto);
  }

  
  @Get('exportar')
exportarProfesores(
  @Res() res: Response,
) {
  this.profesoresService.exportarProfesores().then((excelBuffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=profesores.xlsx');
    res.send(excelBuffer);
  }).catch((error) => {
    console.error(error);
    res.status(500).send(error);
  });
}


  @Get()
  async findAll(@Query() params: FilterProfesorDto): Promise<Profesor[]> {
    return await this.profesoresService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesoresService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfesoreDto: UpdateProfesoreDto,
  ) {
    return this.profesoresService.update(id, updateProfesoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesoresService.remove(id);
  }

  



}

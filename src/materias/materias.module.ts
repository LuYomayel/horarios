import { Module } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Materia, MateriaSchema } from './entities/materia.entity';

import { AuthModule } from '../auth/auth.module';
import { HorarioXCursoModule } from 'src/horario-x-curso/horario-x-curso.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Materia.name, schema: MateriaSchema }]),
    AuthModule,
    HorarioXCursoModule
  ],
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriasModule {}

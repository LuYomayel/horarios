import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { Profesor, ProfesorSchema } from './entities/profesor.entity';

import { AuthModule } from '../auth/auth.module';
import { HorarioXCursoModule } from 'src/horario-x-curso/horario-x-curso.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profesor.name, schema: ProfesorSchema },
    ]),
    AuthModule,
    HorarioXCursoModule
  ],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}

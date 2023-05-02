import { Module } from '@nestjs/common';
import { HorarioXCursoService } from './horario-x-curso.service';
import { HorarioXCursoController } from './horario-x-curso.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HorarioXCurso,
  HorarioXCursoSchema,
} from './entities/horario-x-curso.entity';
import { CursosService } from '../cursos/cursos.service';
import { CursosModule } from '../cursos/cursos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HorarioXCurso.name, schema: HorarioXCursoSchema },
    ]),
    CursosModule,
    AuthModule
  ],
  controllers: [HorarioXCursoController],
  providers: [HorarioXCursoService],
  exports: [MongooseModule]
})
export class HorarioXCursoModule {}
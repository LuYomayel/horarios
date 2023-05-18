import { Module } from '@nestjs/common';
import { HorarioXCursoService } from './horario-x-curso.service';
import { HorarioXCursoController } from './horario-x-curso.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HorarioXCurso,
  HorarioXCursoSchema,
} from './entities/horario-x-curso.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HorarioXCurso.name, schema: HorarioXCursoSchema },
    ]),
    AuthModule
  ],
  controllers: [HorarioXCursoController],
  providers: [HorarioXCursoService],
  exports: [MongooseModule, HorarioXCursoService]
})
export class HorarioXCursoModule {}
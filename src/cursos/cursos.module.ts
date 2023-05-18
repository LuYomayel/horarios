import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';
import { AuthModule } from '../auth/auth.module';
import { HorarioXCursoModule } from '../horario-x-curso/horario-x-curso.module';
import { HorarioXCursoService } from '../horario-x-curso/horario-x-curso.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }]),
    AuthModule,
    HorarioXCursoModule
  ],
  controllers: [CursosController],
  providers: [CursosService, HorarioXCursoService],
  exports: [CursosService],
})
export class CursosModule {}

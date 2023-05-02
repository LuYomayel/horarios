import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './entities/curso.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }]),
    AuthModule,
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}

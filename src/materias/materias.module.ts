import { Module } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Materia, MateriaSchema } from './entities/materia.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Materia.name, schema: MateriaSchema }]),
  ],
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriasModule {}

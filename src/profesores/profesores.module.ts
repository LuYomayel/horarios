import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { Profesor, ProfesorSchema } from './schemas/profesor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profesor.name, schema: ProfesorSchema },
    ]),
  ],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}

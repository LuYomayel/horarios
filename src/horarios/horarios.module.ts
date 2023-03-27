import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Horario, HorarioSchema } from './entities/horario.entity';

import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Horario.name, schema: HorarioSchema }]),
    AuthModule
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}

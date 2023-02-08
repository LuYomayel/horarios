import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfesoresModule } from './profesores/profesores.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { HorariosModule } from './horarios/horarios.module';
import { MateriasModule } from './materias/materias.module';
import { DatabaseModule } from './database/database.module';
import { environments } from './environment';
import { CursosModule } from './cursos/cursos.module';
import { HorarioXCursoModule } from './horario-x-curso/horario-x-curso.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    ProfesoresModule,
    MateriasModule,
    HorariosModule,
    UsuariosModule,
    DatabaseModule,
    CursosModule,
    HorarioXCursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

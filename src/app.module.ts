import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfesoresModule } from './profesores/profesores.module';
import { HorariosModule } from './horarios/horarios.module';
import { MateriasModule } from './materias/materias.module';
import { DatabaseModule } from './database/database.module';
import { environments } from './environment';
import { CursosModule } from './cursos/cursos.module';
import { HorarioXCursoModule } from './horario-x-curso/horario-x-curso.module';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import config from './config';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    ProfesoresModule,
    MateriasModule,
    HorariosModule,
    DatabaseModule,
    CursosModule,
    HorarioXCursoModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}

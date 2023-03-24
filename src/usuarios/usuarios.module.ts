import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { Usuario, UsuarioSchema } from '../auth/entities/usuario.entity';
import { UsuarioService } from './usuarios.services';
import { UsuarioController } from './usuarios.controllers';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Usuario.name, schema: UsuarioSchema },
      ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {} 

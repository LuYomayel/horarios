import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from "../usuarios/usuarios.services";
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    public authService: AuthService,
  ){
    super();
    console.log('AuthService:', authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthService:', this.authService);
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('auth: ', request.headers)
      throw new UnauthorizedException('Missing or invalid token');
    }
    try {
      const token = authHeader.substring(7);
      // const payload = this.jwtService.verify(token);
      // const payload = await this.authService.verifyToken(token);
      // request.user = { username: payload.nombreUsuario, role: payload.roles };
      return true;
    } catch (e) {
      console.log('Error canActivate: ', e)
      throw new UnauthorizedException('Missing or invalid token');
    }
  }

  handleRequest(err, user, info) {
    console.log('Handle: ', user)
    console.log('info: ', info)
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

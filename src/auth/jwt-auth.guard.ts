import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from "../usuarios/usuarios.services";
import { InjectModel } from '@nestjs/mongoose';
import { ERoles, Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { Reflector } from '@nestjs/core';



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    public authService: AuthService,
    private reflector: Reflector,
  ){
    super();
  }

  hasRole(userRoles: ERoles[], requiredRoles: ERoles[]): boolean {
    return requiredRoles.some((requiredRole) => userRoles.includes(requiredRole));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    // console.log('Auth header: ', authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Usuario incorrecto ó no iniciaste sesión');
    }
    try {

      const requiredRoles = this.reflector.get<ERoles[]>('roles', context.getHandler());

      const token = authHeader.substring(7);
      const payload = await this.authService.verifyToken(token);
      request.user = { username: payload.nombreUsuario, role: payload.roles };

      if (requiredRoles && !this.hasRole(payload.roles, requiredRoles)) {
        throw new UnauthorizedException('No tenés el permiso requerido.');
      }

      // console.log('User: ', request.user)
      return true;
    } catch (e) {
      console.log('Error canActivate: ', e.message)
      throw new UnauthorizedException(e.message);
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

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IUsuario } from "./entities/usuario.entity";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from "../usuarios/usuarios.services";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsuarioService
  ) {
    console.log('jwtService: ',jwtService)
    console.log('userService: ',userService)
  }

  async validateUser(username: string, password: string): Promise<IUsuario | null> {
    const user = await this.userService.getUser(username);
    if (user && await bcrypt.compare(password, user.contrasenia)) {
        const { contrasenia, ...rest } = user;
        return rest;
    }
    return null;
  }

  async generateAccessToken(user: IUsuario): Promise<string> {
    const payload = { username: user.nombreUsuario, role: user.roles };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<IUsuario> {
    try {
        const payload = this.jwtService.verify(token);
        const { username } = payload;
        const user = await this.userService.getUser(username);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return user;
    } catch (error) {
        console.log('Error veriryf: ', error)
        throw new UnauthorizedException('Invalid token');
    }
  }
}

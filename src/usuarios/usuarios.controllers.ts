import { Controller, Post, Body,Get, UnauthorizedException } from "@nestjs/common";
import { UsuarioService } from "./usuarios.services";
import { createUsuarioDTO } from "../auth/dto/create-usuario.dto";
import { loginDTO } from "../auth/dto/login.dto";
import { Usuario } from "../auth/entities/usuario.entity"

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async login() {
    return 'Usuarios bro';
  }

  @Post()
  async create(@Body() createUserDto: createUsuarioDTO): Promise<Usuario> {
    return await this.usuarioService.create(createUserDto);
  }
}

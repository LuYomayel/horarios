import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUsuarioDTO } from "./dto/create-usuario.dto";
import { loginDTO } from "./dto/login.dto";
import { Usuario } from "./entities/usuario.entity";

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('AuthService desde controller: ', authService)
  }

  @Post('')
  async login(@Body() loginDto: loginDTO) {
    
    const user = await this.authService.validateUser(loginDto.nombreUsuario, loginDto.contrasenia);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const accessToken = await this.authService.generateAccessToken(user);
    return { access_token: accessToken };
      
  }
}

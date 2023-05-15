import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class ErrorController {
  constructor(private emailService: EmailService) {}

  @Post('error')
  async handleError(@Body('errorMessage') errorMessage: string): Promise<void> {
    await this.emailService.sendErrorEmail(errorMessage);
  }

  @Post('inicioSesion')
  async inicioSesion(@Body('nombreUsuario') nombreUsuario: string): Promise<void> {
    await this.emailService.sendInicioSesionEmail(nombreUsuario);
  }
}

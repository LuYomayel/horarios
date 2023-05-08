import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('error')
export class ErrorController {
  constructor(private emailService: EmailService) {}

  @Post()
  async handleError(@Body('errorMessage') errorMessage: string): Promise<void> {
    await this.emailService.sendErrorEmail(errorMessage);
  }
}

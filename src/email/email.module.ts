import { Module } from "@nestjs/common";
import { ErrorController } from "./email.controller";
import { EmailService } from "./email.service";

@Module({
    imports: [ ],
    controllers: [ErrorController],
    providers: [EmailService],
  })
  export class EmailModule {}
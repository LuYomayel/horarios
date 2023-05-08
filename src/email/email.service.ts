import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { OAuth2Client  } from 'google-auth-library';
// clienteid: 39255711470-mm08bmbse5j9e1p1089dotrho45ido4i.apps.googleusercontent.com


@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private oauth2Client: OAuth2Client ;

    constructor() {
        this.oauth2Client = new OAuth2Client(
            '39255711470-mm08bmbse5j9e1p1089dotrho45ido4i.apps.googleusercontent.com',
            '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',
            'https://developers.google.com/oauthplayground', // Your redirect URL
            );
            this.oauth2Client.setCredentials({
            refresh_token: '1//04y64oQC5YfPpCgYIARAAGAQSNwF-L9IrJaGNxPZaosXHNSvvHvgylkXTop8CDktWkvT18TgHyStIVPkbVCkkzV2afVme-Y8ASkk',
        });

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'gestionhorarios2023@gmail.com',
                clientId: '39255711470-mm08bmbse5j9e1p1089dotrho45ido4i.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//04y64oQC5YfPpCgYIARAAGAQSNwF-L9IrJaGNxPZaosXHNSvvHvgylkXTop8CDktWkvT18TgHyStIVPkbVCkkzV2afVme-Y8ASkk',
                accessToken: this.getAccessToken(),
            },
        });
    }

  async sendErrorEmail(errorMessage: string): Promise<void> {
    const mailOptions = {
      from: 'gestionhorarios2023@gmail.com', // Your email address
      to: 'gestionhorarios2023@gmail.com', // The recipient's email address
      subject: 'Error in Angular App',
      text: `An error occurred in the Angular app: ${errorMessage}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  private async getAccessToken(): Promise<string> {
    const response = await this.oauth2Client.getAccessToken();
    return response.token;
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ERoles {
    ADMIN = 'ADMIN',
    VISUALIZAR = 'VISUALIZAR',
}

export interface IUsuario {
    nombreUsuario: string;
    contrasenia?: string;
    correo: string;
    roles: ERoles[];
}

@Schema()
export class Usuario extends Document implements IUsuario {
  
  @Prop({ required: true })
  nombreUsuario: string;

  @Prop({ required: true })
  contrasenia: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  roles: ERoles[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);





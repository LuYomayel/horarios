import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IUsuario, Usuario } from "../auth/entities/usuario.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { createUsuarioDTO } from "../auth/dto/create-usuario.dto";
@Injectable()
export class UsuarioService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async getUser(username: string): Promise<IUsuario | null> {
    const user = await this.usuarioModel.findOne({ nombreUsuario: username }).exec();
    // console.log('User getUser:', user)
    if (user) {
      const { nombreUsuario, correo, roles , contrasenia} = user.toObject(); // Cambia 'user' a un objeto plano
      return { nombreUsuario, correo, roles, contrasenia } as IUsuario; // Devuelve solo los campos necesarios
    }
    return null;

    // return await this.usuarioModel.findOne({nombreUsuario: username})
    //   // .select('nombreUsuario correo roles')
    //   .exec();
  }

  async create(createUserDto: createUsuarioDTO): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.contrasenia, salt);

    const createdUser = new this.usuarioModel({
      nombreUsuario: createUserDto.nombreUsuario,
      contrasenia: hashedPassword,
      correo: createUserDto.correo,
    });

    return createdUser.save();
  }

  async verifyToken(token: string): Promise<Usuario> {
    try {
        console.log('Token aca: ', token)
        const payload = this.jwtService.verify(token);
        console.log('Verify payload: ', payload)
        // const { username } = payload;
        const user = await this.usuarioModel.findOne().exec();
        // if (!user) {
        //     throw new UnauthorizedException('Invalid token');
        // }
        return user;
    } catch (error) {
        console.log('Error veriryf: ', error)
        throw new UnauthorizedException('Invalid token');
    }
  }
}

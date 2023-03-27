import { SetMetadata } from '@nestjs/common';
import { ERoles } from './entities/usuario.entity';

export const Roles = (...roles: ERoles[]) => SetMetadata('roles', roles);
console.log('Roles decorator: ', Roles)

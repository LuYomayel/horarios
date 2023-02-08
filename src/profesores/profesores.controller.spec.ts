import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test';
import { ProfesorSchema, Profesor } from './entities/profesor.entity';

describe('ProfesoresController', () => {
  let controller: ProfesoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Profesor.name, schema: ProfesorSchema },
        ]),
      ],
      controllers: [ProfesoresController],
      providers: [ProfesoresService],
    }).compile();

    controller = module.get<ProfesoresController>(ProfesoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the corresponding saved proffesor', async () => {
    const profesorPost = await controller.create({
      nombre: 'Luciano',
      apellido: 'Yomayel',
      dni: 42886854,
    });
    const profesor = await controller.findAll({ limit: 1, offset: 0 });
    expect(profesor[0].nombre).toBe(profesorPost.nombre);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});

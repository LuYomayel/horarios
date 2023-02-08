import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfesoresService } from './profesores.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test';
import { ProfesorSchema, Profesor } from './entities/profesor.entity';

describe('ProfesoresService', () => {
  let service: ProfesoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Profesor.name, schema: ProfesorSchema },
        ]),
      ],
      providers: [ProfesoresService],
    }).compile();

    service = module.get<ProfesoresService>(ProfesoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
    Write meaningful test
  **/

  afterAll(async () => {
    await closeInMongodConnection();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HorarioXCursoController } from './horario-x-curso.controller';
import { HorarioXCursoService } from './horario-x-curso.service';

describe('HorarioXCursoController', () => {
  let controller: HorarioXCursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorarioXCursoController],
      providers: [HorarioXCursoService],
    }).compile();

    controller = module.get<HorarioXCursoController>(HorarioXCursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

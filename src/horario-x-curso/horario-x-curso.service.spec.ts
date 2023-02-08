import { Test, TestingModule } from '@nestjs/testing';
import { HorarioXCursoService } from './horario-x-curso.service';

describe('HorarioXCursoService', () => {
  let service: HorarioXCursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorarioXCursoService],
    }).compile();

    service = module.get<HorarioXCursoService>(HorarioXCursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

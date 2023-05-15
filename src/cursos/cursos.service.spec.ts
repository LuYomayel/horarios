import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { ETurno } from '../horario-x-curso/entities/horario-x-curso.entity';
describe('CursosService', () => {
  let cursoService: CursosService;
  let cursoModel: Model<Curso>;
  let connection: Connection;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        {
          provide: getModelToken(Curso.name),
          useValue: {
            new: jest.fn().mockResolvedValue({
              save: jest.fn(),
            }),
            find: jest.fn().mockReturnValue([{}]),
            findOne: jest.fn().mockReturnValue({}),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            model: jest.fn(),
          },
        },
      ],
    }).compile();

    cursoModel = moduleRef.get<Model<Curso>>(getModelToken(Curso.name));
    connection = moduleRef.get<Connection>(Connection);
    cursoService = moduleRef.get<CursosService>(CursosService);
  });

  describe('create', () => {
    it('should create a new curso', async () => {
      const createCursoDto: CreateCursoDto = {
        anio: 2021,
        division: 1,
        turno: ETurno.noche,
      };

      const expected = { _id: '123', ...createCursoDto };

      jest.spyOn(cursoModel.prototype, 'save').mockResolvedValue(expected);

      const result = await cursoService.create(createCursoDto);
      console.log('result: ', result)
      expect(result).toEqual(expected);
    });
  });

//   describe('findAll', () => {
//     it('should return an array of cursos', async () => {
//         const cursos = {
//             anio: 2021,
//             division: 1,
//             notas: '',
//             _id: '123',
//             turno: [ETurno.mañana]
//         }
//         const expected = [cursos, cursos];
        
//         jest.spyOn(cursoModel, 'find').mockReturnValue(expected);

//         const result = await cursoService.findAll();

//         expect(result).toEqual(expected);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a single curso', async () => {
//       const expected = {};

//       jest.spyOn(cursoModel, 'findOne').mockReturnValue(expected);

//       const result = await cursoService.findOne('123');

//       expect(result).toEqual(expected);
//     });
//   });

//   describe('findByAnioAndDivision', () => {
//     it('should return a single curso', async () => {
//       const expected = {};

//       jest.spyOn(cursoModel, 'findOne').mockReturnValue(expected);

//       const result = await cursoService.findByAnioAndDivision(2021, 1);

//       expect(result).toEqual(expected);
//     });
//   });

//   describe('findByTurno', () => {
//     it('should return an array of cursos', async () => {
//       const expected = [{}];

//       jest.spyOn(cursoModel, 'find').mockReturnValue(expected);

//       const result = await cursoService.findByTurno(ETurno.tarde);

//       expect(result).toEqual(expected);
//     });
//   });

//   describe('update', () => {
//     it('should update a curso', async () => {
//       const updateCursoDto: UpdateCursoDto = {
//         anio: 2021,
//         division: 2,
//       };

//       const expected = {};

//       jest.spyOn(cursoModel, 'findOneAndUpdate').mockReturnValue(expected);

//       const result = await cursoService.update('123', updateCursoDto);

//       expect(result).toEqual(expected);
//     });
//     })
});
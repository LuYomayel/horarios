import { Test, TestingModule } from '@nestjs/testing';
import { ProfesoresController } from './profesores.controller';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesor.dto';
import { FilterProfesorDto } from './dto/filter-profesor.dto';
import { Profesor } from './entities/profesor.entity';
import { getModelToken } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { IProfesor } from '../interfaces';
import { never } from 'rxjs';

describe('ProfesoresController', () => {
  let controller: ProfesoresController;
  let service: ProfesoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfesoresController],
      providers: [
        ProfesoresService,
        DatabaseModule,
        {
          provide: getModelToken('Profesor'),
          useValue: {
            // Aquí puedes añadir métodos que utilices en tu servicio
          },
        },
      ],
    }).compile();

    controller = module.get<ProfesoresController>(ProfesoresController);
    service = module.get<ProfesoresService>(ProfesoresService);
  });

  describe('create', () => {
    it('should create a new profesor', async () => {
      const createProfesorDto: CreateProfesoreDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: 42886854,
      };
      const profesor = {
        nombre : createProfesorDto.nombre,
        apellido : createProfesorDto.apellido,
        dni : createProfesorDto.dni,
      }
      jest.spyOn(service, 'create').mockResolvedValue(profesor);

      expect(await controller.create(createProfesorDto)).toBe(profesor);
    });
  });

  describe('findAll', () => {
    it('should return an array of profesores', async () => {
      const filterProfesorDto: FilterProfesorDto = { limit: 2, offset: 0};
      const profesor1 = {
        nombre: 'Juan 1',
        apellido: 'Dominguez 1',
        dni: 42886854,
      }
      const profesor2 = {
        nombre: 'Pedro 2',
        apellido: 'Perez 2',
        dni: 42886854,
      }
      const profesores: IProfesor[] = [profesor1, profesor2];
      jest.spyOn(service, 'findAll').mockResolvedValue([profesor1]);
      const array = await controller.findAll(filterProfesorDto);
      console.log('Array', array);
      expect(array).toHaveLength(1);
      expect(array).toContain(profesor1);
      expect(array).toEqual([profesor1]);
      // expect(await controller.findAll(filterProfesorDto))[0].toEqual([profesor1]);
    });
  });

  describe('findOne', () => {
    it('should return a single profesor', async () => {
      const id = '64129b455f25f28fd4a0415c';
      const profesor: IProfesor = {
        _id : id,
        nombre: 'Juan',
        apellido: 'Perez',
        dni: 42886854,
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(profesor);
      expect(await controller.findOne(id)).toBe(profesor);
    });
  });

  // describe('update', () => {
  //   it('should update a single profesor', async () => {
  //     const id = '64129b455f25f28fd4a0415c';
  //     const updateProfesorDto: CreateProfesoreDto = {
  //       nombre: 'Juan',
  //       apellido: 'Perez',
  //       dni: 42886854,
  //     };
  //     const profesor: IProfesor = {
  //       nombre: 'Juan',
  //       apellido: 'Perez',
  //       dni: 42886854,
  //     }
  //     jest.spyOn(service, 'update').mockResolvedValue(profesor);

  //     expect(await controller.update(id, updateProfesorDto)).toBe(profesor);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a single profesor', async () => {
  //     const id = 1;
  //     jest.spyOn(service, 'remove').mockResolvedValue(undefined);

  //     expect(await controller.remove(id)).toBe(undefined);
  //   });
  // });

});

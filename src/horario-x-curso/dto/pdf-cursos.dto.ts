import { ETurno } from "../entities/horario-x-curso.entity";

export interface IDTOpdf{
    horarios: object,
    schedule: any[],
    curso?: string,
    turno?: ETurno,
    notas?: string,
    profesorElegido?: string,
}
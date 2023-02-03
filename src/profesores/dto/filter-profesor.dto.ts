import { IsPositive, IsOptional, Min } from 'class-validator';

export class FilterProfesorDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}

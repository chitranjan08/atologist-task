// src/games/dto/query-games.dto.ts
import { IsOptional, IsString, IsIn } from 'class-validator';

export class QueryGamesDto {
  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsIn(['Y', 'N'], { message: "editors_choice must be 'Y' or 'N'" })
  editors_choice?: 'Y' | 'N';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: "sort must be either 'asc' or 'desc'" })
  sort?: 'asc' | 'desc';
}

// src/games/dto/query-games.dto.ts
import { IsOptional, IsString, IsIn } from 'class-validator';

export class QueryGamesDto {
  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  // must be 'Y' or 'N' if provided
  @IsOptional()
  @IsIn(['Y', 'N'], { message: "editors_choice must be 'Y' or 'N'" })
  editors_choice?: 'Y' | 'N';

  // optional sort order for score: 'asc' or 'desc'
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: "sort must be either 'asc' or 'desc'" })
  sort?: 'asc' | 'desc';
}

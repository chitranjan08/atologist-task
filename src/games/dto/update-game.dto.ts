// src/games/dto/update-game.dto.ts
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'title must be non-empty' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'platform must be non-empty' })
  platform?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return value;
    return typeof value === 'string' ? parseFloat(value) : value;
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'score must be a number (up to 2 decimal places)' },
  )
  @Min(0, { message: 'score must be >= 0' })
  @Max(100, { message: 'score must be <= 100' })
  score?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'genre must be non-empty' })
  genre?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Y', 'N'], { message: "editors_choice must be either 'Y' or 'N'" })
  editors_choice?: 'Y' | 'N';
}

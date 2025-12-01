// src/games/dto/create-game.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsOptional,
  IsDecimal,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty({ message: 'title must be provided and non-empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'platform must be provided and non-empty' })
  platform: string;

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
  score: number;

  @IsString()
  @IsNotEmpty({ message: 'genre must be provided and non-empty' })
  genre: string;

  @IsString()
  @IsIn(['Y', 'N'], { message: "editors_choice must be either 'Y' or 'N'" })
  editors_choice: 'Y' | 'N';
}

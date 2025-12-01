// src/scripts/seed-games.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { GamesService } from '../games/games.service';
import { CreateGameDto } from '../games/dto/create-game.dto';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  // Boot a minimal Nest app to use GamesService and Config/TypeORM setup
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const gamesService = app.get(GamesService);

  // path to CSV: change if needed
  const csvPath = process.argv[2] || path.resolve(__dirname, '../../games_data.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    await app.close();
    process.exit(1);
  }

  const parser = fs
    .createReadStream(csvPath)
    .pipe(parse({
      columns: true, // treat first row as header
      trim: true,
      skip_empty_lines: true,
    }));

  const validationPipe = new ValidationPipe({ transform: true, whitelist: true });

  let imported = 0;
  let skipped = 0;
  let errors: Array<{ row: any; reason: any }> = [];

  for await (const record of parser) {
    // record is an object with keys matching CSV headers
    // Map CSV columns to DTO fields — adapt names if CSV header names differ
    // Expected headers: title, platform, score, genre, editors_choice
    try {
      // Normalize fields
      const dto: any = {
        title: record.title ?? record.Title ?? record.game_title,
        platform: record.platform ?? record.Platform,
        // convert empty to undefined, numeric strings allowed
        score: record.score !== undefined && record.score !== '' ? Number(record.score) : undefined,
        genre: record.genre ?? record.Genre,
        editors_choice: (record.editors_choice ?? record.editorsChoice ?? record.Editors_choice ?? record.editors_choice)?.toString().trim(),
      };

      // ensure editors_choice normalized to 'Y' or 'N' (accept yes/no/true/false)
      if (typeof dto.editors_choice === 'string') {
        const v = dto.editors_choice.toUpperCase();
        if (v === 'YES' || v === 'Y' || v === 'TRUE' || v === '1') dto.editors_choice = 'Y';
        else if (v === 'NO' || v === 'N' || v === 'FALSE' || v === '0') dto.editors_choice = 'N';
      }

      // Validate DTO using Nest's ValidationPipe (reuses your validators)
      const validated = await validationPipe.transform(dto, {
        type: 'body',
        metatype: CreateGameDto,
      });

      // Optional: avoid duplicate (title+platform) — try to find existing
      const existing = await (gamesService as any).findAllFiltered?.({
        platform: validated.platform,
        // do partial title match for exact same title check
      });
      // naive uniqueness check: if any existing has same title & platform, skip
      const duplicate = Array.isArray(existing) && existing.some((g:any) => (g.title === validated.title && g.platform === validated.platform));
      if (duplicate) {
        skipped++;
        continue;
      }

      await gamesService.create(validated as CreateGameDto);
      imported++;
    } catch (err) {
      skipped++;
      errors.push({ row: record, reason: err?.message ?? err });
    }
  }

  console.log(`Import finished. imported=${imported}, skipped=${skipped}`);
  if (errors.length) {
    console.error('Some rows failed to import (showing first 10):', errors.slice(0, 10));
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('Unexpected failure', err);
  process.exit(1);
});

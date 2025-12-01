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
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const gamesService = app.get(GamesService);

  const csvPath = process.argv[2] || path.resolve(__dirname, '../../games_data.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    await app.close();
    process.exit(1);
  }

  const parser = fs
    .createReadStream(csvPath)
    .pipe(parse({
      columns: true, 
      trim: true,
      skip_empty_lines: true,
    }));

  const validationPipe = new ValidationPipe({ transform: true, whitelist: true });

  let imported = 0;
  let skipped = 0;
  let errors: Array<{ row: any; reason: any }> = [];

  for await (const record of parser) {
   
    try {
      const dto: any = {
        title: record.title ?? record.Title ?? record.game_title,
        platform: record.platform ?? record.Platform,
        score: record.score !== undefined && record.score !== '' ? Number(record.score) : undefined,
        genre: record.genre ?? record.Genre,
        editors_choice: (record.editors_choice ?? record.editorsChoice ?? record.Editors_choice ?? record.editors_choice)?.toString().trim(),
      };

      if (typeof dto.editors_choice === 'string') {
        const v = dto.editors_choice.toUpperCase();
        if (v === 'YES' || v === 'Y' || v === 'TRUE' || v === '1') dto.editors_choice = 'Y';
        else if (v === 'NO' || v === 'N' || v === 'FALSE' || v === '0') dto.editors_choice = 'N';
      }

      const validated = await validationPipe.transform(dto, {
        type: 'body',
        metatype: CreateGameDto,
      });

      const existing = await (gamesService as any).findAllFiltered?.({
        platform: validated.platform,
      });
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

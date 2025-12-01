// src/games/games.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards,Query, Patch, Delete    } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryGamesDto } from './dto/query-games.dto';
import { UpdateGameDto } from './dto/update-game.dto';
@UseGuards(JwtAuthGuard) // <-- protect all routes in this controller
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create(@Body() dto: CreateGameDto) {
    // ValidationPipe (global) will validate dto before this runs
    const created = await this.gamesService.create(dto);
    return { message: 'Game created', data: created };
  }



  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Get('search/:title')
 async search(@Param('title') title: string) {
  const games = await this.gamesService.searchByTitle(title);
  return { results: games };
}

 @Get()
  async list(@Query() query: QueryGamesDto) {
    const results = await this.gamesService.findAllFiltered({
      platform: query.platform,
      genre: query.genre,
      editors_choice: query.editors_choice,
      sort: query.sort,
    });
    return { results };
  }

  @Patch(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateGameDto,
) {
  const updated = await this.gamesService.update(id, dto);
  return { message: 'Game updated', data: updated };
}

@Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.gamesService.remove(id);
    return result;
  }
}


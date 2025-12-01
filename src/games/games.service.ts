// src/games/games.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepo: Repository<Game>,
  ) {}

  create(dto: CreateGameDto) {
    const game = this.gamesRepo.create({
      title: dto.title,
      platform: dto.platform,
      score: dto.score,
      genre: dto.genre,
      editors_choice: dto.editors_choice,
    });
    return this.gamesRepo.save(game);
  }
async searchByTitle(title: string) {
  return this.gamesRepo.find({
    where: { title },
  });
}

async update(id: number, dto: Partial<CreateGameDto> | Partial<UpdateGameDto>) {
  const game = await this.gamesRepo.findOne({ where: { id } });
  if (!game) {
    throw new NotFoundException(`Game with id ${id} not found`);
  }

  const updated = this.gamesRepo.merge(game, dto as any);

  return this.gamesRepo.save(updated);
}
async findAllFiltered(opts: {
    platform?: string;
    genre?: string;
    editors_choice?: 'Y' | 'N';
    sort?: 'asc' | 'desc';
  }) {
    const qb = this.gamesRepo.createQueryBuilder('game');

    if (opts.platform) {
      qb.andWhere('game.platform = :platform', { platform: opts.platform });
    }

    if (opts.genre) {
      qb.andWhere('game.genre = :genre', { genre: opts.genre });
    }

    if (opts.editors_choice) {
      qb.andWhere('game.editors_choice = :ec', { ec: opts.editors_choice });
    }

    if (opts.sort && (opts.sort === 'asc' || opts.sort === 'desc')) {
      qb.orderBy('CAST(game.score AS DECIMAL(10,2))', opts.sort.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('game.id', 'ASC');
    }

    const results = await qb.getMany();
    return results;
  }

  findAll() {
    return this.gamesRepo.find();
  }

  findOne(id: number) {
    return this.gamesRepo.findOne({ where: { id } });
  }
async remove(id: number) {
  const game = await this.gamesRepo.findOne({ where: { id } });
  if (!game) {
    throw new NotFoundException(`Game with id ${id} not found`);
  }

  await this.gamesRepo.delete(id);

  return { message: `Game with id ${id} deleted` };
}
  
}



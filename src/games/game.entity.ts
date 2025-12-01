// src/games/game.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  platform: string;

  // score can be decimal; adjust precision/scale if needed
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'varchar', length: 100 })
  genre: string;

  // store 'Y' or 'N'
  @Column({ type: 'char', length: 1, name: 'editors_choice' })
  editors_choice: 'Y' | 'N';
}

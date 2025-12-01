// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(userPartial: Partial<User>) {
    const user = this.usersRepo.create(userPartial);
    return this.usersRepo.save(user);
  }

  async setCurrentRefreshToken(hashedRefreshToken: string, userId: number) {
    await this.usersRepo.update(userId, { refreshToken: hashedRefreshToken });
  }

  async removeRefreshToken(userId: number) {
    await this.usersRepo.update(userId, { refreshToken: null });
  }
}

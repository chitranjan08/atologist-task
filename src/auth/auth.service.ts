// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hashData(data: string) {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hashed, firstName, lastName });
    return { id: user.id, email: user.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const pwMatches = await bcrypt.compare(password, user.password);
    if (!pwMatches) return null;
    return user;
  }

  async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '15m';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION') || '7d';

    const accessToken = await this.jwtService.signAsync(payload as any, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      // cast to any so TS accepts string durations like '15m'
      expiresIn: accessExpiresIn as any,
    });

    const refreshToken = await this.jwtService.signAsync({ sub: userId } as any, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: refreshExpiresIn as any,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email);
    // hash refresh token before saving to DB
    const hashedRefreshToken = await this.hashData(tokens.refresh_token);
    await this.usersService.setCurrentRefreshToken(hashedRefreshToken, user.id);

    return {
      user: { id: user.id, email: user.email },
      tokens,
    };
  }

  async logout(userId: number) {
    // remove stored refresh token
    await this.usersService.removeRefreshToken(userId);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access denied');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new UnauthorizedException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    const hashedRefreshToken = await this.hashData(tokens.refresh_token);
    await this.usersService.setCurrentRefreshToken(hashedRefreshToken, user.id);

    return tokens;
  }
}

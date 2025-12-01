// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password, dto.firstName, dto.lastName);
    return { message: 'Registered', user };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto.email, dto.password);
    // client receives tokens in response body (you can also set HTTP-only cookie here)
    return data;
  }

  // refresh: expects { userId, refreshToken } in body OR you could implement cookie-based refresh
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    const tokens = await this.authService.refreshTokens(body.userId, body.refreshToken);
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user: any = (req as any).user;
    await this.authService.logout(user.userId);
    return { message: 'Logged out' };
  }

  // a protected test route
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    // @ts-ignore
    return (req as any).user;
  }
}

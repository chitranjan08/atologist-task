// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            
    forbidNonWhitelisted: false, 
    transform: true,            
    transformOptions: { enableImplicitConversion: false }, 
  }));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}
bootstrap();

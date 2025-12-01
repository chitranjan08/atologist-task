// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation and transform incoming payloads to DTO classes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // remove properties not in DTO
    forbidNonWhitelisted: false, // optional - set true to reject extra props
    transform: true,            // <-- IMPORTANT: turns plain object into class instance
    transformOptions: { enableImplicitConversion: false }, // optional
  }));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}
bootstrap();

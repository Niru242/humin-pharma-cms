import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 4000);
  const corsOrigin = configService.get<string>('APP_CORS_ORIGIN', 'http://localhost:3000');

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'X-Record-Version'],
  });

  // Global prefix — all routes under /v1
  app.setGlobalPrefix('v1');

  // Global validation pipe — validates DTOs using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true, // Reject unknown properties with error
      transform: true,          // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter — structured errors, no stack trace leaks
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);
  console.log(`[PharmaHRMS] API running on http://localhost:${port}/v1`);
  console.log(`[PharmaHRMS] CORS origin: ${corsOrigin}`);
  console.log(`[PharmaHRMS] Environment: ${configService.get('APP_ENV', 'development')}`);
}

bootstrap();

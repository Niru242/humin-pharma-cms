import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

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

  // Global prefix
  app.setGlobalPrefix('v1');

  await app.listen(port);
  console.log(`[PharmaHRMS] API running on http://localhost:${port}/v1`);
}

bootstrap();

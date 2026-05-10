import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfig } from './common/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationError: ValidationError[] = []) => {
        const errors = validationError.reduce<Record<string, string[]>>(
          (acc, error) => {
            acc[error.property] = Object.values(error.constraints ?? {});
            return acc;
          },
          {},
        );

        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  await app.listen(AppConfig.port ?? 3000);
}
void bootstrap();

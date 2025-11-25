import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Подключаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Удаляет поля, не указанные в DTO
      forbidNonWhitelisted: true, // Выдаёт ошибку, если есть лишние поля
      transform: true,        // Преобразует строки в числа и т.д.
      disableErrorMessages: false, // Показывает ошибки валидации
      validationError: {
        target: false,        // Не возвращать DTO в ошибке
        value: false,         // Не возвращать значение в ошибке
      },
    }),
  );

  // Подключаем глобальный фильтр ошибок
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Orders Service')
    .setDescription('API for managing orders') 
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
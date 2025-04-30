import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { enviroment } from 'enviroment';
import { ExceptionsHandler } from './exceptions/exception.filter';
//cargo variables del environment en la aplicacion
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // <-- AGREGAR ESTO
  });

  app.enableCors({
    origin: 'http://localhost:4200', // URL de tu app Angular
    credentials: true,
  });

  // bodyParser para limitar el tamaño del cuerpo de las solicitudes a lo definido en la variable de entorno
  app.use(bodyParser.json({ limit: enviroment.APP_LIMIT }));

  //prefijo global para las rutas de la API
  app.setGlobalPrefix('api');

  //ValidationPipe global para validar los datos de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsHandler());

  await app.listen(enviroment.APP_PORT);
}
bootstrap();

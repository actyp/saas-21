import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // RabbitMQ Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
      ],
      queue: 'soa-auth',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.use(cookieParser());
  app.enableShutdownHooks();

  await app.startAllMicroservicesAsync();
  await app.listen(3001, () =>
    console.log('Service is listening on port 3001'),
  );
}
bootstrap();

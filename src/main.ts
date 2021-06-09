import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
      queue: 'soa-question-provider',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  app.enableShutdownHooks();

  await app.listen(3003, () =>
    console.log('Service is listening on port 3003'),
  );
}
bootstrap();

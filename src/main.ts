import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // rabbit Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      //url: 'mqtt://localhost:1883',
      urls: [
        'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
      ],
      queue: 'soa-question-management',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  app.enableShutdownHooks();

  await app.listen(3002, () =>
    console.log('Service is listening on port 3002'),
  );
}
bootstrap();

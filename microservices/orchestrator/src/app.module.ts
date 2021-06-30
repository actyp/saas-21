import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'auth',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'QUESTION_MANAGEMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'question-management',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'QUESTION_PROVIDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'question-provider',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}

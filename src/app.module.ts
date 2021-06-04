import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionProviderModule } from './question-provider/question-provider.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ESB_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'services-to-esb',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    QuestionProviderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

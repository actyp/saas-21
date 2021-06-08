import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionManagementModule } from './question-management/question-management.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ESB_CLIENT',
        transport: Transport.RMQ,
        options: {
          //url: 'mqtt://localhost:1883',
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'soa-esb',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    QuestionManagementModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

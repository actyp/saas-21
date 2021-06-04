import { Module } from '@nestjs/common';
import { QuestionManagementService } from './question-management.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATA_LAYER',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://jjhwhfuy:6ANsWwfWg-HGgtkFAfx6jV7nfVvvRAn5@cow.rmq2.cloudamqp.com/jjhwhfuy',
          ],
          queue: 'soa-data-layer',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [QuestionManagementService],
  exports: [QuestionManagementService],
})
export class QuestionManagementModule {}

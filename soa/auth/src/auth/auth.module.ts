import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.refresh_token_secret,
    }),
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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

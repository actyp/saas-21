import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
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
          queue: 'soa-esb',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    JwtModule.register({
      secret: jwtConstants.access_token_secret,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

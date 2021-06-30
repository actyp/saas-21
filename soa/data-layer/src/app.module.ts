import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataLayerModule } from './data-layer/data-layer.module';

@Module({
  imports: [DataLayerModule],
  controllers: [AppController],
})
export class AppModule {}

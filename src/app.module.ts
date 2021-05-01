import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionProviderModule } from './question-provider/question-provider.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [QuestionProviderModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}

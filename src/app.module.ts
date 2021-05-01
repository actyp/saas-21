import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionManagementModule } from './question-management/question-management.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [QuestionManagementModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}

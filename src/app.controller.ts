import { Controller, Logger } from '@nestjs/common';
import { QuestionManagementService } from './question-management/question-management.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private questionManagement: QuestionManagementService,
    private authService: AuthService,
  ) {}

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  @MessagePattern('create_question')
  async create_question(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionManagement.create_question(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('create_answer')
  async create_answer(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionManagement.create_answer(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }
}

import { Controller, Logger } from '@nestjs/common';
import { QuestionProviderService } from './question-provider/question-provider.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private questionProvider: QuestionProviderService,
    private authService: AuthService,
  ) {}

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  @MessagePattern('questions')
  async questions(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.questionProvider.questions(data);
  }

  @MessagePattern('my_questions')
  async my_questions(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionProvider.my_questions(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('my_answers')
  async my_answers(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionProvider.my_answers(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('answers_per_question')
  async answers_per_question(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.questionProvider.answers_per_question(data);
  }

  @MessagePattern('question_per_keyword_count')
  async question_per_keyword_count() {
    return this.questionProvider.question_per_keyword_count();
  }

  @MessagePattern('question_per_date_count')
  async question_per_date_count() {
    return this.questionProvider.question_per_date_count();
  }

  @MessagePattern('my_question_per_date_count')
  async my_question_per_date_count(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionProvider.my_question_per_date_count(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('my_answer_per_date_count')
  async my_answer_per_date_count(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.questionProvider.my_answer_per_date_count(data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }
}

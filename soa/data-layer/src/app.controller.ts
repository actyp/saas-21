import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DataLayerService } from './data-layer/data-layer.service';

@Controller()
export class AppController {
  constructor(private dataLayer: DataLayerService) {}

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  @MessagePattern('set_refresh_token')
  async set_refresh_token(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.set_refresh_token(data.username, data.refresh_token);
  }

  @MessagePattern('exists_user')
  async exists_user(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.exists_user(data.username);
  }

  @MessagePattern('add_user')
  async add_user(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.add_user(data.username, data.hash);
  }

  @MessagePattern('get_user')
  async get_user(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_user(data.username);
  }

  @MessagePattern('exists_question')
  async exists_question(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.exists_question(data.question_id);
  }

  @MessagePattern('add_question')
  async add_question(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.add_question(data.username, data.question_info);
  }

  @MessagePattern('add_answer')
  async add_answer(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.add_answer(data.username, data.answer_info);
  }

  @MessagePattern('get_question')
  async get_question(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_question(data.question_id);
  }

  @MessagePattern('get_answer')
  async get_answer(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_answer(data.answer_id);
  }

  @MessagePattern('get_questions')
  async get_questions(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_questions(data.start, data.stop);
  }

  @MessagePattern('get_my_questions')
  async get_my_questions(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_my_questions(data.username);
  }

  @MessagePattern('get_my_answers')
  async get_my_answers(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_my_answers(data.username);
  }

  @MessagePattern('get_answers_per_question')
  async get_answers_per_question(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_answers_per_question(data.question_id);
  }

  @MessagePattern('get_keywords')
  async get_keywords() {
    return this.dataLayer.get_keywords();
  }

  @MessagePattern('get_question_dates')
  async get_question_dates() {
    return this.dataLayer.get_question_dates();
  }

  @MessagePattern('get_my_question_dates')
  async get_my_question_dates(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_my_question_dates(data.username);
  }

  @MessagePattern('get_my_answer_dates')
  async get_my_answer_dates(@Payload() payload) {
    const data = this.json_parse(payload);
    return this.dataLayer.get_my_answer_dates(data.username);
  }
}

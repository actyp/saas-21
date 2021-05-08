import { Injectable } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';

interface CreateQuestionDto {
  username: string;
  title: string;
  text: string;
  keywords: string[];
}

interface CreateAnswerDto {
  username: string;
  question_id: string;
  text: string;
}

@Injectable()
export class QuestionManagementService {
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(private redisClient: RedisClientService) {}

  private static get_date() {
    const unix = parseInt((new Date().getTime() / 1000).toFixed(0));

    const date = new Date(unix * 1000);
    const [year, month, day, hour, minutes, seconds] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];

    const timestamp =
      year.toString() +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      day.toString().padStart(2, '0') +
      ' ' +
      hour.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0');

    return [timestamp, date.toDateString(), unix];
  }

  async create_question(data: CreateQuestionDto) {
    if (data.title === undefined || data.text === undefined) {
      return this.status_code[400];
    }

    const [timestamp, date_string, unix] = QuestionManagementService.get_date();
    const question_id = Buffer.from(
      data.username + '[' + timestamp + ']',
    ).toString('base64');

    let ok = await this.redisClient.hmset('question:' + question_id, {
      title: data.title,
      text: data.text,
    });
    if (!ok) {
      return this.status_code[500];
    }

    ok =
      (await this.redisClient.zadd(
        data.username + ':questions',
        unix,
        question_id,
      )) &&
      (await this.redisClient.lpush('questions', question_id)) &&
      (await this.redisClient.hincrby(
        data.username + ':questions:dates',
        date_string,
        1,
      )) &&
      (await this.redisClient.hincrby('questions:dates', date_string, 1));

    /**
     * handle keywords gracefully
     * */
    if (data.keywords !== undefined && Array.isArray(data.keywords)) {
      ok =
        ok &&
        (await this.redisClient.sadd(
          'question:' + question_id + ':keywords',
          ...data.keywords,
        ));

      for (const keyword of data.keywords) {
        ok = ok && (await this.redisClient.hincrby('keywords', keyword, 1));
      }
    }

    if (!ok) {
      return this.status_code[500];
    }

    return { date: timestamp };
  }

  async create_answer(data: CreateAnswerDto) {
    const redis = await this.redisClient.getClient();
    if (
      data.question_id === undefined ||
      !(await redis.exists('question:' + data.question_id)) ||
      data.text === undefined
    ) {
      return this.status_code[400];
    }

    const [timestamp, date_string, unix] = QuestionManagementService.get_date();
    const answer_id = Buffer.from(
      data.username + '[' + timestamp + ']',
    ).toString('base64');

    let ok = await this.redisClient.hmset('answer:' + answer_id, {
      question_id: data.question_id,
      text: data.text,
    });
    if (!ok) {
      return this.status_code[500];
    }

    ok =
      (await this.redisClient.zadd(
        data.username + ':answers',
        unix,
        answer_id,
      )) &&
      (await this.redisClient.sadd(
        'question:' + data.question_id + ':answers',
        answer_id,
      )) &&
      (await this.redisClient.hincrby(
        data.username + ':answers:dates',
        date_string,
        1,
      ));

    if (!ok) {
      return this.status_code[500];
    }

    return { date: timestamp };
  }
}

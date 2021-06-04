import { RedisClientService } from '../redis-client/redis-client.service';
import { Injectable, Logger } from '@nestjs/common';

interface QuestionInfo {
  question_id: string;
  title: string;
  text: string;
  keywords: string[];
  unix: number;
  date_string: string;
}

interface AnswerInfo {
  answer_id: string;
  text: string;
  unix: number;
  date_string: string;
  question_id: string;
}

@Injectable()
export class DataLayerService {
  private readonly logger = new Logger(DataLayerService.name);
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(private redisClient: RedisClientService) {}

  async set_refresh_token(username: string, refresh_token: string) {
    if (
      await this.redisClient.hmset(username, { refresh_token: refresh_token })
    ) {
      return this.status_code[200];
    }
    return this.status_code[500];
  }

  async exists_user(username: string) {
    const redis = await this.redisClient.getClient();
    if ((await redis.exists(username)) > 0) {
      return { exists: 'true' };
    }
    return { exists: 'false' };
  }

  async add_user(username: string, hash: string) {
    const redis = await this.redisClient.getClient();
    const code = await redis
      .watch(username)
      .then(() =>
        redis
          .multi()
          .hmset(username, { password: hash, refresh_token: '' })
          .exec(),
      )
      .then((results) => {
        if (results[0][0]) {
          this.logger.error(results[0][0]);
          return 500;
        }
        if (results[0][1] === null) {
          return 406;
        }
        return 201;
      })
      .catch((err) => {
        this.logger.error(err);
        return 500;
      });

    return this.status_code[code];
  }

  async get_user(username: string) {
    return this.redisClient.hgetall(username);
  }

  async exists_question(question_id: string) {
    const redis = await this.redisClient.getClient();
    if ((await redis.exists('question:' + question_id)) > 0) {
      return { exists: 'true' };
    }
    return { exists: 'false' };
  }

  async add_question(username: string, question_info: QuestionInfo) {
    const { question_id, title, text, keywords, unix, date_string } =
      question_info;

    let ok = await this.redisClient.hmset('question:' + question_id, {
      title,
      text,
    });

    if (!ok) {
      return this.status_code[500];
    }

    ok =
      (await this.redisClient.zadd(
        username + ':questions',
        unix,
        question_id,
      )) &&
      (await this.redisClient.lpush('questions', question_id)) &&
      (await this.redisClient.hincrby(
        username + ':questions:dates',
        date_string,
        1,
      )) &&
      (await this.redisClient.hincrby('questions:dates', date_string, 1));

    if (!ok) {
      return this.status_code[500];
    }

    /**
     * handle keywords gracefully
     * */
    if (keywords !== undefined) {
      ok =
        ok &&
        (await this.redisClient.sadd(
          'question:' + question_id + ':keywords',
          ...keywords,
        ));

      for (const keyword of keywords) {
        ok = ok && (await this.redisClient.hincrby('keywords', keyword, 1));
      }
    }

    if (!ok) {
      return this.status_code[500];
    }

    return this.status_code[200];
  }

  async add_answer(username: string, answer_info: AnswerInfo) {
    const { answer_id, text, unix, date_string, question_id } = answer_info;

    let ok = await this.redisClient.hmset('answer:' + answer_id, {
      question_id,
      text,
    });

    if (!ok) {
      return this.status_code[500];
    }

    ok =
      (await this.redisClient.zadd(username + ':answers', unix, answer_id)) &&
      (await this.redisClient.zadd(
        'question:' + question_id + ':answers',
        unix,
        answer_id,
      )) &&
      (await this.redisClient.hincrby(
        username + ':answers:dates',
        date_string,
        1,
      ));

    if (!ok) {
      return this.status_code[500];
    }

    return this.status_code[200];
  }

  async get_question(question_id: string) {
    const key = 'question:' + question_id;
    const question = await this.redisClient.hgetall(key);
    const keywords = await this.redisClient.smembers(key + ':keywords');
    return { question: question, keywords: keywords };
  }

  async get_answer(answer_id: string) {
    return this.redisClient.hgetall('answer:' + answer_id);
  }

  async get_questions(start: number, stop: number) {
    return this.redisClient.lrange('questions', start, stop);
  }

  async get_my_questions(username: string) {
    return this.redisClient.zrevrange(username + ':questions', 0, -1);
  }

  async get_my_answers(username: string) {
    return this.redisClient.zrange(username + ':answers', 0, -1);
  }

  async get_answers_per_question(question_id: string) {
    return this.redisClient.zrevrange(
      'question:' + question_id + ':answers',
      0,
      -1,
    );
  }

  async get_keywords() {
    return this.redisClient.hgetall('keywords');
  }

  async get_question_dates() {
    return this.redisClient.hgetall('questions:dates');
  }

  async get_my_question_dates(username: string) {
    return this.redisClient.hgetall(username + ':questions:dates');
  }

  async get_my_answer_dates(username: string) {
    return this.redisClient.hgetall(username + ':answers:dates');
  }
}

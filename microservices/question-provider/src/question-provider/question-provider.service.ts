import { Injectable } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';

interface QuestionsDto {
  start: string;
  stop: string;
}

@Injectable()
export class QuestionProviderService {
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(private redisClient: RedisClientService) {}

  static decode_id(id: string) {
    const decoded = Buffer.from(id, 'base64').toString();
    const username = decoded.substring(0, decoded.length - 21);
    const date = decoded.substring(decoded.length - 20, decoded.length - 1);
    return [username, date];
  }

  async get_question(question_id: string) {
    const [username, date] = QuestionProviderService.decode_id(question_id);

    const question = await this.redisClient.hgetall('question:' + question_id);
    const keywords = await this.redisClient.smembers(
      'question:' + question_id + ':keywords',
    );

    question.id = question_id;
    question.username = username;
    question.date = date;
    question.keywords = keywords;
    return question;
  }

  async get_answer(answer_id: string, include_question_id = true) {
    const [username, date] = QuestionProviderService.decode_id(answer_id);

    const answer = await this.redisClient.hgetall('answer:' + answer_id);

    answer.id = answer_id;
    answer.username = username;
    answer.date = date;
    if (!include_question_id) {
      delete answer.question_id;
    }
    return answer;
  }

  async questions(data: QuestionsDto) {
    let stop: number;
    if (data.stop === undefined) {
      stop = -1;
    } else {
      stop = parseInt(data.stop);
    }

    if (data.start === undefined) {
      return this.status_code[400];
    }

    const start = parseInt(data.start);

    return await Promise.all(
      (
        await this.redisClient.lrange('questions', start, stop)
      ).map((question_id) => this.get_question(question_id)),
    );
  }

  async my_questions(username: string) {
    return await Promise.all(
      (await this.redisClient.zrevrange(username + ':questions', 0, -1)).map(
        async (question_id) => await this.get_question(question_id),
      ),
    );
  }

  async my_answers(username: string) {
    const answers = await Promise.all(
      (await this.redisClient.zrange(username + ':answers', 0, -1)).map(
        async (answer_id) => await this.get_answer(answer_id),
      ),
    );

    const q2a: Record<string, any>[][] = [];
    let id;
    for (const answer of answers) {
      id = new Date(
        QuestionProviderService.decode_id(answer.question_id)[1],
      ).getTime();
      if (q2a[id] === undefined) {
        q2a[id] = [answer];
      } else {
        q2a[id].push(answer);
      }
    }

    const re = [];
    for (const id in q2a) {
      re.unshift({
        question: await this.get_question(q2a[id][0].question_id),
        answers: q2a[id],
      });
    }

    return re;
  }

  async answers_per_question(question_id: string) {
    if (question_id === undefined) {
      return this.status_code[400];
    }

    return await Promise.all(
      (
        await this.redisClient.zrevrange(
          'question:' + question_id + ':answers',
          0,
          -1,
        )
      ).map(async (answer_id) => await this.get_answer(answer_id, false)),
    );
  }

  async question_per_keyword_count() {
    return Object.entries(await this.redisClient.hgetall('keywords')).reduce<
      Record<string, any>
    >((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async question_per_date_count() {
    return Object.entries(
      await this.redisClient.hgetall('questions:dates'),
    ).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async my_question_per_date_count(username: string) {
    return Object.entries(
      await this.redisClient.hgetall(username + ':questions:dates'),
    ).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async my_answer_per_date_count(username: string) {
    return Object.entries(
      await this.redisClient.hgetall(username + ':answers:dates'),
    ).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }
}

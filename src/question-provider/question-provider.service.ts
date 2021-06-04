import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

interface QuestionsDto {
  start: string;
  stop: string;
}

@Injectable()
export class QuestionProviderService {
  private readonly logger = new Logger(QuestionProviderService.name);
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(@Inject('DATA_LAYER') private readonly data_layer: ClientProxy) {}

  async data_layer_request(pattern: string, body): Promise<any> {
    let re;
    this.data_layer
      .send(pattern, JSON.stringify(body))
      .pipe(timeout(2000))
      .subscribe(
        (value: any) => {
          re = value;
        },
        (error) => {
          this.logger.error(error);
          re = this.status_code[500];
        },
      );

    return re;
  }

  static decode_id(id: string) {
    const decoded = Buffer.from(id, 'base64').toString();
    const username = decoded.substring(0, decoded.length - 21);
    const date = decoded.substring(decoded.length - 20, decoded.length - 1);
    return [username, date];
  }

  async get_question(question_id: string) {
    const [username, date] = QuestionProviderService.decode_id(question_id);

    const re = await this.data_layer_request('get_question', {
      question_id: question_id,
    });

    let question, keywords;
    if ('statusCode' in re) {
      question = {
        title: 'This Question could not be loaded. Please try again later.',
        text: '',
      };
      keywords = [];
    } else {
      question = re.question;
      keywords = re.keywords;
    }

    question.id = question_id;
    question.username = username;
    question.date = date;
    question.keywords = keywords;
    return question;
  }

  async get_answer(answer_id: string, include_question_id = true) {
    const [username, date] = QuestionProviderService.decode_id(answer_id);

    const re = await this.data_layer_request('get_answer', {
      answer_id: answer_id,
    });

    let answer;
    if ('statusCode' in re) {
      answer = {
        text: 'This Answer could not be loaded. Please try again later.',
      };
    } else {
      answer = re;
    }

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

    const re = await this.data_layer_request('get_questions', {
      start: start,
      stop: stop,
    });

    if ('statusCode' in re) {
      return re;
    }

    return await Promise.all(
      re.map((question_id) => this.get_question(question_id)),
    );
  }

  async my_questions(username: string) {
    const re = await this.data_layer_request('get_my_questions', {
      username: username,
    });

    if ('statusCode' in re) {
      return re;
    }

    return await Promise.all(
      re.map(async (question_id) => await this.get_question(question_id)),
    );
  }

  async my_answers(username: string) {
    const re = await this.data_layer_request('get_my_answers', {
      username: username,
    });

    if ('statusCode' in re) {
      return re;
    }

    const answers: any[] = await Promise.all(
      re.map(async (answer_id) => await this.get_answer(answer_id)),
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

    const ret = [];
    for (const id in q2a) {
      ret.unshift({
        question: await this.get_question(q2a[id][0].question_id),
        answers: q2a[id],
      });
    }

    return ret;
  }

  async answers_per_question(question_id: string) {
    if (question_id === undefined) {
      return this.status_code[400];
    }

    const re = await this.data_layer_request('get_answers_per_question', {
      question_id: question_id,
    });

    if ('statusCode' in re) {
      return re;
    }

    return await Promise.all(
      re.map(async (answer_id) => await this.get_answer(answer_id, false)),
    );
  }

  async question_per_keyword_count() {
    const re: Record<string, string> = await this.data_layer_request(
      'get_keywords',
      {},
    );

    if ('statusCode' in re) {
      return re;
    }
    return Object.entries(re).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async question_per_date_count() {
    const re: Record<string, string> = await this.data_layer_request(
      'get_question_dates',
      {},
    );

    if ('statusCode' in re) {
      return re;
    }
    return Object.entries(re).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async my_question_per_date_count(username: string) {
    const re: Record<string, string> = await this.data_layer_request(
      'get_my_question_dates',
      { username: username },
    );

    if ('statusCode' in re) {
      return re;
    }
    return Object.entries(re).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }

  async my_answer_per_date_count(username: string) {
    const re: Record<string, string> = await this.data_layer_request(
      'get_my_answer_dates',
      { username: username },
    );

    if ('statusCode' in re) {
      return re;
    }
    return Object.entries(re).reduce<Record<string, any>>((acc, curr) => {
      acc[curr[0]] = parseInt(curr[1]);
      return acc;
    }, {});
  }
}

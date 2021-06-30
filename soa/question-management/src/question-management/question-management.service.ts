import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

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
  private readonly logger = new Logger(QuestionManagementService.name);
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
    return this.data_layer
      .send(pattern, JSON.stringify(body))
      .pipe(timeout(2000))
      .toPromise()
      .then((value) => {
        return value;
      })
      .catch((error) => {
        this.logger.error(error);
        return this.status_code[500];
      });
  }

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

    const question_info = {
      question_id: question_id,
      title: data.title,
      text: data.text,
      keywords: data.keywords,
      unix: unix,
      date_string: date_string,
    };
    const re = await this.data_layer_request('add_question', {
      username: data.username,
      question_info: question_info,
    });

    if (re.statusCode !== 200) {
      return re;
    }

    return { date: timestamp };
  }

  async create_answer(data: CreateAnswerDto) {
    const res = await this.data_layer_request('exists_user', {
      username: data.username,
    });
    if ('statusCode' in res) {
      return res;
    } else if (res.exists === 'true') {
      return this.status_code[400];
    }

    if (data.question_id === undefined || data.text === undefined) {
      return this.status_code[400];
    }

    const [timestamp, date_string, unix] = QuestionManagementService.get_date();
    const answer_id = Buffer.from(
      data.username + '[' + timestamp + ']',
    ).toString('base64');

    const answer_info = {
      answer_id: answer_id,
      text: data.text,
      unix: unix,
      date_string: date_string,
      question_id: data.question_id,
    };
    const re = await this.data_layer_request('add_answer', {
      username: data.username,
      answer_info: answer_info,
    });

    if (re.statusCode !== 200) {
      return re;
    }

    return { date: timestamp };
  }
}

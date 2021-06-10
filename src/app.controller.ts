import {
  Body,
  Controller,
  Request,
  Post,
  Inject,
  Logger,
  Res,
  HttpStatus,
  Get,
  Query,
  Scope,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

@Controller({ path: 'api', scope: Scope.REQUEST })
export class AppController {
  private readonly logger = new Logger(AppController.name);

  private microservice_response;

  constructor(
    @Inject('AUTH_SERVICE') private readonly auth_client: ClientProxy,
    @Inject('QUESTION_MANAGEMENT_SERVICE')
    private readonly question_management_client: ClientProxy,
    @Inject('QUESTION_PROVIDER_SERVICE')
    private readonly question_provider_client: ClientProxy,
  ) {
    this.respond = this.respond.bind(this);
    this.respond_to_login = this.respond_to_login.bind(this);
  }

  private static parse_auth_header(hdrValue) {
    const re = /(\S+)\s+(\S+)/;
    if (typeof hdrValue !== 'string') {
      return null;
    }
    const matches = hdrValue.match(re);
    return matches && { scheme: matches[1], value: matches[2] };
  }

  private static jwt_from_header(req) {
    if (req.headers['authorization']) {
      const auth_params = AppController.parse_auth_header(
        req.headers['authorization'],
      );
      if (auth_params && auth_params.scheme.toLowerCase() === 'bearer') {
        return auth_params.value;
      }
    }
    return undefined;
  }

  private respond(res) {
    if (this.microservice_response.statusCode !== undefined) {
      res.statusMessage = this.microservice_response.message;
      res.status(this.microservice_response.statusCode).send();
    } else {
      res.status(HttpStatus.OK).json(this.microservice_response);
    }
  }

  private respond_to_login(res) {
    if (this.microservice_response.statusCode !== undefined) {
      res.statusMessage = this.microservice_response.message;
      res.status(this.microservice_response.statusCode).send();
    } else {
      res.cookie('refresh_token', this.microservice_response.refresh_token, {
        httpOnly: true,
        //        secure: true,
        expires: new Date(this.microservice_response.refresh_token_expiry),
      });
      delete this.microservice_response.refresh_token;
      delete this.microservice_response.refresh_token_expiry;
      res.status(HttpStatus.OK).json(this.microservice_response).send();
    }
  }

  async client_send(
    client: ClientProxy,
    res,
    pattern: string,
    body,
    on_complete_callback,
  ) {
    const yellow_str = (str) => '\x1b[33m' + str + '\x1b[0m';
    const request_msg = (time_elapsed) =>
      `Request to ${pattern} +${yellow_str(time_elapsed + 'ms')}`;

    const sent_time = Date.now();
    client
      .send(pattern, JSON.stringify(body))
      .pipe(timeout(2000))
      .subscribe(
        (value: any) => {
          const recd_time = Date.now();
          this.logger.log(request_msg(recd_time - sent_time));
          this.microservice_response = value;
        },
        (error) => {
          this.logger.error(error);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        },
        () => {
          on_complete_callback(res);
        },
      );
  }

  @Get('authenticate/refresh')
  async refresh(@Request() req, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      'refresh',
      { refresh_token: req.cookies.refresh_token },
      this.respond,
    );
  }

  @Post('authenticate/login')
  async login(@Body() body, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      'login',
      body,
      this.respond_to_login,
    );
  }

  @Post('authenticate/logout')
  async logout(@Request() req, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      'logout',
      { refresh_token: req.cookies.refresh_token },
      this.respond,
    );
  }

  @Post('authenticate/signup')
  async signup(@Body() body, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      'signup',
      body,
      this.respond,
    );
  }

  @Post('manage/create-question')
  async create_question(@Body() body, @Request() req, @Res() res) {
    body.access_token = AppController.jwt_from_header(req);
    return this.client_send(
      this.question_management_client,
      res,
      'create_question',
      body,
      this.respond,
    );
  }

  @Post('manage/create-answer')
  async create_answer(@Body() body, @Request() req, @Res() res) {
    body.access_token = AppController.jwt_from_header(req);
    return this.client_send(
      this.question_management_client,
      res,
      'create_answer',
      body,
      this.respond,
    );
  }

  @Get('provide/questions')
  async questions(@Query() query, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'questions',
      { start: query.start, stop: query.stop },
      this.respond,
    );
  }

  @Get('provide/my-questions')
  async my_questions(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'my_questions',
      { access_token: AppController.jwt_from_header(req) },
      this.respond,
    );
  }

  @Get('provide/my-answers')
  async my_answers(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'my_answers',
      { access_token: AppController.jwt_from_header(req) },
      this.respond,
    );
  }

  @Get('provide/answers-per-question')
  async answers_per_question(@Query() query, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'answers_per_question',
      { question_id: query.id },
      this.respond,
    );
  }

  @Get('provide/question-per-keyword-count')
  async question_per_keyword_count(@Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'question_per_keyword_count',
      {},
      this.respond,
    );
  }

  @Get('provide/question-per-date-count')
  async question_per_date_count(@Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'question_per_date_count',
      {},
      this.respond,
    );
  }

  @Get('provide/my-question-per-date-count')
  async my_question_per_date_count(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'my_question_per_date_count',
      { access_token: AppController.jwt_from_header(req) },
      this.respond,
    );
  }

  @Get('provide/my-answer-per-date-count')
  async my_answer_per_date_count(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      'my_answer_per_date_count',
      { access_token: AppController.jwt_from_header(req) },
      this.respond,
    );
  }
}

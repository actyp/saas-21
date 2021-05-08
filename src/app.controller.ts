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
      res.status(HttpStatus.OK).json(this.microservice_response).send();
    }
  }

  private respond_to_login(res) {
    if (this.microservice_response.statusCode !== undefined) {
      res.statusMessage = this.microservice_response.message;
      res.status(this.microservice_response.statusCode).send();
    } else {
      res.cookie('refresh_token', this.microservice_response.refresh_token, {
        httpOnly: true,
        secure: true,
      });
      delete this.microservice_response.refresh_token;
      res.status(HttpStatus.OK).json(this.microservice_response).send();
    }
  }

  async client_send(
    client: ClientProxy,
    res,
    body,
    pattern: string,
    on_complete_callback,
  ) {
    client.send(pattern, JSON.stringify(body)).subscribe(
      (value: any) => {
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

  @Get('refresh')
  async refresh(@Request() req, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      { refresh_token: req.cookies.refresh_token },
      'refresh',
      this.respond,
    );
  }

  @Post('login')
  async login(@Body() body, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      body,
      'login',
      this.respond_to_login,
    );
  }

  @Post('logout')
  async logout(@Request() req, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      { refresh_token: req.cookies.refresh_token },
      'logout',
      this.respond,
    );
  }

  @Post('signup')
  async signup(@Body() body, @Res() res) {
    return this.client_send(
      this.auth_client,
      res,
      body,
      'signup',
      this.respond,
    );
  }

  @Post('create-question')
  async create_question(@Body() body, @Request() req, @Res() res) {
    body.access_token = AppController.jwt_from_header(req);
    return this.client_send(
      this.question_management_client,
      res,
      body,
      'create_question',
      this.respond,
    );
  }

  @Post('create-answer')
  async create_answer(@Body() body, @Request() req, @Res() res) {
    body.access_token = AppController.jwt_from_header(req);
    return this.client_send(
      this.question_management_client,
      res,
      body,
      'create_answer',
      this.respond,
    );
  }

  @Get('questions')
  async questions(@Query() query, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { start: query.start, stop: query.stop },
      'questions',
      this.respond,
    );
  }

  @Get('my-questions')
  async my_questions(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { access_token: AppController.jwt_from_header(req) },
      'my_questions',
      this.respond,
    );
  }

  @Get('my-answers')
  async my_answers(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { access_token: AppController.jwt_from_header(req) },
      'my_answers',
      this.respond,
    );
  }

  @Get('answers-per-question')
  async answers_per_question(@Query() query, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { question_id: query.id },
      'answers_per_question',
      this.respond,
    );
  }

  @Get('question-per-keyword-count')
  async question_per_keyword_count(@Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      {},
      'question_per_keyword_count',
      this.respond,
    );
  }

  @Get('question-per-date-count')
  async question_per_date_count(@Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      {},
      'question_per_date_count',
      this.respond,
    );
  }

  @Get('my-question-per-date-count')
  async my_question_per_date_count(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { access_token: AppController.jwt_from_header(req) },
      'my_question_per_date_count',
      this.respond,
    );
  }

  @Get('my-answer-per-date-count')
  async my_answer_per_date_count(@Request() req, @Res() res) {
    return this.client_send(
      this.question_provider_client,
      res,
      { access_token: AppController.jwt_from_header(req) },
      'my_answer_per_date_count',
      this.respond,
    );
  }
}

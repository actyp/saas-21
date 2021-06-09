import {
  Controller,
  Inject,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

@Controller()
export class AppController implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly auth_client: ClientProxy,
    @Inject('QUESTION_MANAGEMENT_SERVICE')
    private readonly question_management_client: ClientProxy,
    @Inject('QUESTION_PROVIDER_SERVICE')
    private readonly question_provider_client: ClientProxy,
  ) {}

  private readonly status_code = {
    500: { statusCode: 500, message: 'Internal server error' },
    503: { statusCode: 503, message: 'Service Unavailable' },
  };

  private services = {
    AUTH_SERVICE: {
      client: this.auth_client,
      patterns: ['authenticate'],
      status: 0,
    },
    QUESTION_MANAGEMENT_SERVICE: {
      client: this.question_management_client,
      patterns: [],
      status: 0,
    },
    QUESTION_PROVIDER_SERVICE: {
      client: this.question_provider_client,
      patterns: [],
      status: 0,
    },
  };

  onApplicationBootstrap() {
    for (const name in this.services) {
      this.services[name].client.emit('healthcheck', {});
    }
  }

  @EventPattern('service_info')
  add_service_info(@Payload() payload) {
    const { name, status } = payload;
    this.services[name].status = status;
    const msg = `Update: ${name} - status: ${status ? 'listening' : 'stopped'}`;
    status ? this.logger.log(msg) : this.logger.warn(msg);
  }

  @MessagePattern('service_discovery')
  service_discovery() {
    this.logger.log('Requested service discovery');
    const disc = {};
    for (const name in this.services) {
      disc[name] = { patterns: this.services[name].patterns };
    }
    return disc;
  }

  async send_and_wait(
    service_name: string,
    pattern: string,
    payload,
  ): Promise<any> {
    const yellow_str = (str) => '\x1b[33m' + str + '\x1b[0m';
    const request_msg = (time_elapsed) =>
      `Request to ${pattern} +${yellow_str(time_elapsed + 'ms')}`;

    if (this.services[service_name].status === 0) {
      this.logger.error(service_name + ' Unavailable');
      return this.status_code[503];
    } else {
      const sent_time = Date.now();
      return this.services[service_name].client
        .send(pattern, payload)
        .pipe(timeout(2000))
        .toPromise()
        .then((value) => {
          const recd_time = Date.now();
          this.logger.log(request_msg(recd_time - sent_time));
          return value;
        })
        .catch((error) => {
          this.logger.error(error);
          return this.status_code[500];
        });
    }
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() payload): Promise<any> {
    return await this.send_and_wait('AUTH_SERVICE', 'authenticate', payload);
  }
}

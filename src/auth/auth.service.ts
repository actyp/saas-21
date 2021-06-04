import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

interface SignUpDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(
    @Inject('DATA_LAYER') private readonly data_layer: ClientProxy,
    private jwtService: JwtService,
  ) {}

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

  async local_guard(data: any) {
    const user = await this.validatePassword(data.username, data.password);
    if (user === null) {
      throw new Error('Unauthorized');
    }
    return data;
  }

  async jwt_guard(data: any) {
    try {
      this.jwtService.verify(data.refresh_token);
    } catch (error) {
      throw new Error('Unauthorized');
    }

    const jwt_decoded: any = this.jwtService.decode(data.refresh_token);
    const user = await this.data_layer_request('get_user', {
      username: jwt_decoded.username,
    });

    if (
      'statusCode' in user ||
      Object.keys(user).length == 0 ||
      user.refresh_token !== data.refresh_token
    ) {
      throw new Error('Unauthorized');
    }

    data.username = jwt_decoded.username;
    return data;
  }

  async validatePassword(username: string, pass: string): Promise<any> {
    const user = await this.data_layer_request('get_user', {
      username: username,
    });
    if ('statusCode' in user || Object.keys(user).length == 0) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      return { username: username };
    }
    return null;
  }

  async refresh(username: string) {
    const access_token_expiry = new Date(new Date().getTime() + 900 * 1000);
    const access_token = this.jwtService.sign(
      { username: username },
      { secret: jwtConstants.access_token_secret, expiresIn: '900s' },
    );

    return {
      access_token: access_token,
      access_token_expiry: access_token_expiry.getTime(),
    };
  }

  async login(username: string) {
    const access_token_expiry = new Date(new Date().getTime() + 900 * 1000);
    const access_token = this.jwtService.sign(
      { username: username },
      { secret: jwtConstants.access_token_secret, expiresIn: '900s' },
    );

    const refresh_token_expiry = new Date(new Date().getTime() + 432000 * 1000);
    const refresh_token = this.jwtService.sign(
      { username: username },
      { expiresIn: '432000s' },
    );
    const re = await this.data_layer_request('set_refresh_token', {
      username: username,
      refresh_token: refresh_token,
    });

    if (re.statusCode !== 200) {
      return this.status_code[500];
    }

    return {
      username: username,
      access_token: access_token,
      access_token_expiry: access_token_expiry.getTime(),
      refresh_token: refresh_token,
      refresh_token_expiry: refresh_token_expiry.getTime(),
    };
  }

  async logout(username: string) {
    const re = await this.data_layer_request('set_refresh_token', {
      username: username,
      refresh_token: '',
    });

    if (re.statusCode !== 200) {
      return this.status_code[500];
    }
    return this.status_code[200];
  }

  async signup(data: SignUpDto) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      data.username === undefined ||
      data.password === undefined ||
      data.username.length > 255 ||
      !regex.test(data.username)
    ) {
      return this.status_code[400];
    }

    const hash = await bcrypt.hash(data.password, 10);

    const re = await this.data_layer_request('exists_user', {
      username: data.username,
    });
    if ('statusCode' in re) {
      return re;
    } else if (re.exists === 'true') {
      return this.status_code[406];
    }

    return await this.data_layer_request('add_user', {
      username: data.username,
      hash: hash,
    });
  }
}

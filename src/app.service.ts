import { Injectable } from '@nestjs/common';

// injetável, quer dizer que posso usar essa dep. em outros controllers
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

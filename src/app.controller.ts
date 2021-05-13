import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Measure } from './measure.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Measure {
    return this.appService.getMeasure();
  }
}

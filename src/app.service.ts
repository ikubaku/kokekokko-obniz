import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import Obniz from 'obniz';

import { Measure } from './measure.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private latestMeasure: Measure = { weight: 0, datetime: 0, status: 'noData' };
  private obnizId: string;

  constructor(private configService: ConfigService) {
    this.obnizId = configService.get('OBNIZ_ID');
  }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('0 * * * * *')
  async measure() {
    this.logger.log('Begin measuring...');
    const obniz = new Obniz(this.obnizId, {
      auto_connect: false,
      reset_obniz_on_ws_disconnection: false,
    });

    const isConnected = await obniz.connectWait({ timeout: 10 });
    if (isConnected) {
      const sensor = obniz.wired('hx711', {
        gnd: 0,
        dout: 1,
        sck: 2,
        vcc: 3,
      });
      sensor.powerUp();
      const value = await sensor.getValueWait(10);
      this.logger.log('grams: ' + value);
      this.latestMeasure.weight = value;
      this.latestMeasure.datetime = Date.now();
      this.latestMeasure.status = 'ok';
      sensor.powerDown();
      await obniz.closeWait();
    } else {
      if (this.latestMeasure.status != 'noData') {
        this.latestMeasure.status = 'ng';
      }
    }
  }

  getWeight(): number {
    // stub
    return 42;
  }
}

import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AppService, ShortUrlType } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getShortUrlTest(@Query('url') url: string): ShortUrlType {
    return this.appService.getShortUrl(url);
  }

  @Get('/real/:key')
  getRealUrl(@Param('key') key: string): string {
    return `welcome! this is real url page! ** ${key} ** `;
  }

  @Get('/short/:key')
  @HttpCode(302)
  redirectShortUrl(@Param('key') key: string, @Res() res: Response): void {
    const urls = this.appService.getRealUrl(key);
    console.log('find: ', urls);
    res.redirect(urls.originalUrl);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AppService, ShortUrlType } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /* 단축 URL을 통해 접속하는 API (테스트를 위해 임의 생성) */
  @Get('/real/:key')
  getRealUrl(@Param('key') key: string): string {
    return `welcome! this is real url page! ** ${key} ** `;
  }

  /* 단축 URL을 생성하는 API */
  @Post('/short')
  makeShortUrl(@Body() body: { url: string }): ShortUrlType {
    return this.appService.getShortUrl(body.url);
  }

  /* 단축 URL로 리다이렉트하는 API */
  @Get('/short/:key')
  @HttpCode(302)
  redirectShortUrl(@Param('key') key: string, @Res() res: Response): void {
    const urls = this.appService.getRealUrl(key);
    console.log('find: ', urls);
    res.redirect(urls.originalUrl);
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import * as base62 from 'base62/lib/ascii';
import * as crypto from 'crypto';
import { identity } from 'rxjs';
import { url } from 'inspector';
import { Url } from './database/url.model';

interface urlForm {
  url: string;
  base: string;
  key: string;
}

export interface ShortUrlType {
  hash: string;
  base62: string;
}

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}
  getRealUrl(key: string): Url {
    return this.databaseService.getByShortUrl(key);
  }

  getShortUrl(url: string): ShortUrlType {
    const hashUrl = this.generateShortUrlUseHash(url);
    const base62 = this.generateShortUrlUseBase62();

    this.databaseService.save(
      {
        originalUrl: url,
        shortUrlHash: hashUrl,
        shortUrlBase62: base62.url,
      },
      base62.id,
    );

    return {
      hash: hashUrl,
      base62: base62.url,
    };
  }

  /* 방식1. 해시 후 충돌 해소 */
  generateShortUrlUseHash(url: string): string {
    let shortUrl = this.makeHashUrl(url);

    // 만들어진 문자열이 이미 존재하는 경우 다시 생성
    while (this.databaseService.checkShortUrlHashExist(shortUrl)) {
      shortUrl = this.makeHashUrl(url);
    }
    return shortUrl;
  }

  /* 방식2. base62 인코딩 */
  generateShortUrlUseBase62() {
    const uniqueId = this.makeUniqueId();
    const encode = base62.encode(uniqueId);
    return {
      id: uniqueId,
      url: encode,
    };
  }

  /* base62 인코딩을 위한 고유 아이디 생성 */
  makeUniqueId(): number {
    // todo: 더 좋은 방식으로 변경
    return Math.floor(Math.random() * 1000000) + Date.now();
  }

  /* sha-1 해시를 이용한 문자열 생성 */
  makeHashUrl(url: string) {
    let hash = crypto
      .createHash('sha1')
      .update(url)
      .digest('hex')
      .substring(0, 6);

    // 만들어진 문자열의 길이를 잘랐을 때 중복되는 경우가 있을 수 있으므로 랜덤 문자열을 추가
    const randomString = Math.random().toString(36).substring(2, 8);
    hash += randomString;
    return hash;
  }
}

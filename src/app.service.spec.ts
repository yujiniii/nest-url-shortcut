import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { Url } from './database/url.model';

describe('AppService', () => {
  let appService: AppService;
  const mockExistShortUrl = new Url(
    1718094480344,
    'http://localhost:3000/real/testtest',
    '85bcb39ao26y',
    'ufnnlBS',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: {
            getByShortUrl: jest.fn(() => mockExistShortUrl),
            save: jest.fn(),
            checkShortUrlHashExist: jest.fn(() => false),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('getRealUrl', () => {
    const key = '85bcb39ao26y';
    const result = appService.getRealUrl(key);
    expect(result).toEqual(mockExistShortUrl);
  });

  it('getShortUrl', () => {
    const url = 'http://localhost:3000/real/testtest';
    const result = appService.getShortUrl(url);
    expect(result.hash).toBeDefined();
    expect(result.base62).toBeDefined();
  });
});

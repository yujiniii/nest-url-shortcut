import { Injectable } from '@nestjs/common';
import { Url } from './url.model';
import * as XLSX from 'xlsx';

@Injectable()
export class DatabaseService {
  private filePath = `./urls.xlsx`;
  private sheetName = 'Urls';

  getByShortUrl(shortUrl: string): Url {
    const urls = this.readFile();
    return urls.find(
      (u) => u.shortUrlBase62 === shortUrl || u.shortUrlHash === shortUrl,
    );
  }

  save(dto: Omit<Url, 'id'>, id?: number): void {
    const urls = this.readFile();
    urls.push({
      id: id ? id : this.generateId(), // base62 인코딩 과정에서 만들어진 id를 우선사용, 없으면 새로 생성
      ...dto,
    });
    this.writeFile(urls);
  }

  checkShortUrlHashExist(shortUrl: string): boolean {
    const urls = this.readFile();
    return urls.some((u) => u?.shortUrlHash === shortUrl);
  }

  private readFile(): Url[] {
    const workbook = XLSX.readFile(this.filePath);
    const sheet = workbook.Sheets[this.sheetName];
    const data: Url[] = XLSX.utils.sheet_to_json(sheet);

    return data.map(
      (row) =>
        new Url(row.id, row.originalUrl, row.shortUrlHash, row.shortUrlBase62),
    );
  }

  private writeFile(urls: Url[]): void {
    const worksheet = XLSX.utils.json_to_sheet(urls);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.sheetName);
    XLSX.writeFile(workbook, this.filePath);
  }

  private generateId(): number {
    const urls = this.readFile();
    return urls.length + 1;
  }
}

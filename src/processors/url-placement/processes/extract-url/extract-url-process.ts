import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractUrlProcess {
  async execute(url: string, html: string): Promise<string[]> {
    const urls = new Set<string>();
    const $ = cheerio.load(html);

    const origin = new URL(url).origin;

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          const url = new URL(href, origin);
          if (url.origin === origin) {
            urls.add(url.href);
          }
        } catch (error) {
          // ignore
        }
      }
    });

    return Array.from(urls);
  }
}

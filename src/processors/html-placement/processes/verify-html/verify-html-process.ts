import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Hash,
  HashDocument,
} from '@processors/html-placement/processes/verify-html/hash-schema';
import { createHash } from 'crypto';
import { Model } from 'mongoose';

@Injectable()
export class VerifyHtmlProcess {
  constructor(
    @InjectModel(Hash.name)
    private readonly hashModel: Model<HashDocument>,
  ) {}

  async execute(html: string): Promise<boolean> {
    const hash = createHash('sha256').update(html).digest('hex');

    try {
      await this.hashModel.create(new Hash(hash));
      return false;
    } catch (error) {
      return true;
    }
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export enum UrlStatus {
  PENDING = 'pending',
  DOWNLOADED = 'downloaded',
  FAIL = 'fail',
}

export type UrlDocument = HydratedDocument<Url>;

@Schema({ collection: 'urls' })
export class Url {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    length: 100,
  })
  hostName: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  url: string;

  @Prop({
    type: SchemaTypes.String,
    default: UrlStatus.PENDING,
    length: 10,
  })
  status?: UrlStatus;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
  })
  depth?: number;

  @Prop({
    type: SchemaTypes.Date,
    default: Date.now,
  })
  createdAt?: Date;

  @Prop({
    type: SchemaTypes.Date,
  })
  updatedAt?: Date;

  constructor(url: string, depth?: number, status?: UrlStatus) {
    this.hostName = new URL(url).hostname;
    this.url = url;
    this.status = status;
    this.depth = depth;
  }
}

export const UrlSchema = SchemaFactory.createForClass(Url);

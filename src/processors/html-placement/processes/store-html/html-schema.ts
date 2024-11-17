import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type HtmlDocument = HydratedDocument<Html>;

@Schema({ collection: 'htmls' })
export class Html {
  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  url: string;

  @Prop({
    type: SchemaTypes.String,
    unique: true,
    required: true,
    length: 64,
  })
  file: string;

  @Prop({ type: SchemaTypes.String, required: true, length: 30 })
  bucket: string;

  @Prop({ type: SchemaTypes.Date, default: Date.now })
  createdAt: Date;

  constructor(url: string, file: string, bucket: string) {
    this.url = url;
    this.file = file;
    this.bucket = bucket;
  }
}

export const HtmlSchema = SchemaFactory.createForClass(Html);

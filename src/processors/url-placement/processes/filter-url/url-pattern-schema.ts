import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type UrlPatternDocument = HydratedDocument<UrlPattern>;

@Schema({ collection: 'url_patterns' })
export class UrlPattern {
  @Prop({
    type: SchemaTypes.String,
    length: 100,
    unique: true,
    required: true,
  })
  hostName: string;

  @Prop({
    type: [SchemaTypes.String],
    required: true,
  })
  regexes: string[];

  constructor(hostName: string, regexes: string[]) {
    this.hostName = hostName;
    this.regexes = regexes;
  }
}

export const UrlPatternSchema = SchemaFactory.createForClass(UrlPattern);

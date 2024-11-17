import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type SelectPatternDocument = HydratedDocument<SelectPattern>;

@Schema({ collection: 'select_patterns' })
export class SelectPattern {
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

export const SelectPatternSchema = SchemaFactory.createForClass(SelectPattern);
SelectPatternSchema.index({ hostName: 1 });

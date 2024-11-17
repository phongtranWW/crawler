import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type HashDocument = HydratedDocument<Hash>;

@Schema({ collection: 'hashes' })
export class Hash {
  @Prop({ type: SchemaTypes.String, unique: true, required: true, length: 64 })
  hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }
}

export const HashSchema = SchemaFactory.createForClass(Hash);

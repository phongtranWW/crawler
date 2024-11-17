import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export enum QueueProcessor {
  HOST_ONE = 1,
  HOST_TWO = 2,
  HOST_THREE = 3,
}

export type RouterDocument = HydratedDocument<Router>;

@Schema({ collection: 'routers' })
export class Router {
  @Prop({
    type: SchemaTypes.String,
    length: 100,
    unique: true,
    required: true,
  })
  hostName: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  queueProcessor: QueueProcessor;

  @Prop({
    type: SchemaTypes.Number,
    default: 3000,
  })
  delay: number;

  constructor(hostName: string, queueProcessor: QueueProcessor, delay: number) {
    this.hostName = hostName;
    this.queueProcessor = queueProcessor;
    this.delay = delay;
  }
}

export const RouterSchema = SchemaFactory.createForClass(Router);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';  // Assuming you have a User schema
import { Question } from 'src/questions/schemas/question.schema';  // Assuming you have a Question schema

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }], required: true })
  questions: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  uniqueURL: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: 0 })
  score: number;
}

export const TestSchema = SchemaFactory.createForClass(Test);

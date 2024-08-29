// tests.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { QuestionsModule } from '../questions/questions.module'; // Adjust the path as needed
import { Test, TestSchema } from './schemas/test.schema'; // Adjust the path as needed

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    QuestionsModule, // Import QuestionsModule to use QuestionModel
  ],
  providers: [TestsService],
  controllers: [TestsController]
})
export class TestsModule {}

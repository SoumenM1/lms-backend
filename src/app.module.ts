import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://soumen:YzTyPQ7gAIEsw5OG@cluster0.c5spa4r.mongodb.net/nestDB?retryWrites=true&w=majority&appName=Cluster0'),
    AuthModule,
    QuestionsModule,
    TestsModule,
  ],
})
export class AppModule {}

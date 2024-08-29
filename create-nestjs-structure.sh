#!/bin/bash

# Create directories
mkdir -p src/auth/dto src/auth/schemas src/questions/dto src/questions/schemas src/tests/dto src/tests/schemas

# Create files for Auth Module
echo "export class CreateAuthDto {
  readonly username: string;
  readonly password: string;
}" > src/auth/dto/create-auth.dto.ts

echo "export class LoginAuthDto {
  readonly username: string;
  readonly password: string;
}" > src/auth/dto/login-auth.dto.ts

echo "import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);" > src/auth/schemas/user.schema.ts

echo "import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}" > src/auth/auth.controller.ts

echo "import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createAuthDto: CreateAuthDto): Promise<User> {
    const newUser = new this.userModel(createAuthDto);
    return newUser.save();
  }

  async login(loginAuthDto: LoginAuthDto): Promise<User> {
    return this.userModel.findOne({ username: loginAuthDto.username, password: loginAuthDto.password }).exec();
  }
}" > src/auth/auth.service.ts

echo "import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}" > src/auth/auth.module.ts

# Create files for Questions Module (using previous code as base)
echo "export class CreateQuestionDto {
  readonly text: string;
  readonly options: string[];
  readonly correctAnswer: string;
}" > src/questions/dto/create-question.dto.ts

echo "export class UpdateQuestionDto {
  readonly text?: string;
  readonly options?: string[];
  readonly correctAnswer?: string;
}" > src/questions/dto/update-question.dto.ts

echo "import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);" > src/questions/schemas/question.schema.ts

echo "import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  async findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}" > src/questions/questions.controller.ts

echo "import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question.name) private questionModel: Model<QuestionDocument>) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(\`Question with ID \${id} not found\`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const existingQuestion = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
    if (!existingQuestion) {
      throw new NotFoundException(\`Question with ID \${id} not found\`);
    }
    return existingQuestion;
  }

  async remove(id: string): Promise<Question> {
    const deletedQuestion = await this.questionModel.findByIdAndRemove(id).exec();
    if (!deletedQuestion) {
      throw new NotFoundException(\`Question with ID \${id} not found\`);
    }
    return deletedQuestion;
  }
}" > src/questions/questions.service.ts

echo "import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}" > src/questions/questions.module.ts

# Create files for Tests Module
echo "export class CreateTestDto {
  readonly title: string;
  readonly questions: string[];
}" > src/tests/dto/create-test.dto.ts

echo "export class UpdateTestDto {
  readonly title?: string;
  readonly questions?: string[];
}" > src/tests/dto/update-test.dto.ts

echo "import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  questions: string[];
}

export const TestSchema = SchemaFactory.createForClass(Test);" > src/tests/schemas/test.schema.ts

echo "import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @Get()
  async findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(id, updateTestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}" > src/tests/tests.controller.ts

echo "import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './schemas/test.schema';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(@InjectModel(Test.name) private testModel: Model<TestDocument>) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const newTest = new this.testModel(createTestDto);
    return newTest.save();
  }

  async findAll(): Promise<Test[]> {
    return this.testModel.find().exec();
  }

  async findOne(id: string): Promise<Test> {
    const test = await this.testModel.findById(id).exec();
    if (!test) {
      throw new NotFoundException(\`Test with ID \${id} not found\`);
    }
    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    const existingTest = await this.testModel.findByIdAndUpdate(id, updateTestDto, { new: true }).exec();
    if (!existingTest) {
      throw new NotFoundException(\`Test with ID \${id} not found\`);
    }
    return existingTest;
  }

  async remove(id: string): Promise<Test> {
    const deletedTest = await this.testModel.findByIdAndRemove(id).exec();
    if (!deletedTest) {
      throw new NotFoundException(\`Test with ID \${id} not found\`);
    }
    return deletedTest;
  }
}" > src/tests/tests.service.ts

echo "import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test, TestSchema } from './schemas/test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}" > src/tests/tests.module.ts

# Create App and Main files
echo "import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    AuthModule,
    QuestionsModule,
    TestsModule,
  ],
})
export class AppModule {}" > src/app.module.ts

echo "import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();" > src/main.ts

echo "Directory structure and files have been created."

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './schemas/test.schema';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Test.name) private readonly testModel: Model<TestDocument>, // Inject other models if necessary
  ) {}

  // Retrieve a test by ID (admin only)
  async findOne(id: string): Promise<Test> {
    return this.testModel.findById(id).populate('questions').exec();
  }

  // Retrieve a test by unique URL
  async findOneByURL(uniqueURL: string): Promise<Test> {
    return this.testModel.findOne({ uniqueURL }).populate('questions').exec();
  }

  // Start a new adaptive test
  async startTest(testId: string): Promise<Test> {
    const test = await this.testModel.findById(testId).exec();
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    // Logic to initialize or reset the test before starting
    test.attempts += 1;
    await test.save();
    return test;
  }

  // Submit an answer for a question and get the next question
  async submitAnswer(testId: string, questionId: string, answer: string) {
    const test = await this.testModel.findById(testId).populate('questions').exec();
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Logic to handle the answer, update the test, and determine the next question
    const isCorrect = question.correctAnswer === answer;

    // Determine the next question based on difficulty
    const nextQuestion = await this.getNextQuestion(isCorrect, test);

    // Logic to update the test (score, progress, etc.)
    test.score += this.calculateScore(question.difficulty, isCorrect);
    await test.save();

    return {
      correct: isCorrect,
      nextQuestion,
    };
  }

  private async getNextQuestion(isCorrect: boolean, test: TestDocument): Promise<Question> {
    // Logic to determine the next question based on the adaptive algorithm
    let nextDifficulty = 5; // Default starting difficulty
    if (isCorrect) {
      nextDifficulty += 1; // Increase difficulty if correct
    } else {
      nextDifficulty -= 1; // Decrease difficulty if incorrect
    }

    // Ensure difficulty stays within bounds
    nextDifficulty = Math.min(Math.max(nextDifficulty, 1), 10);

    return this.questionModel.findOne({ difficulty: nextDifficulty }).exec();
  }

  private calculateScore(difficulty: number, isCorrect: boolean): number {
    // Example score calculation logic
    return isCorrect ? difficulty * 10 : 0;
  }
}

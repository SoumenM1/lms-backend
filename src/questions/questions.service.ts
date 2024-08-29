import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question.name) private questionModel: Model<QuestionDocument>) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async findAll(page: number = 1): Promise<Question[]> {
    const limit = 10;
    const skip = (page - 1) * limit;

    return this.questionModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const existingQuestion = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return existingQuestion;
  }

  async remove(id: string): Promise<Question> {
    const deletedQuestion = await this.questionModel.findByIdAndDelete(id).exec();
    if (!deletedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return deletedQuestion;
  }
}

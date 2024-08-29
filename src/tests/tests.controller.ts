import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { TestsService } from './tests.service';
// import { CreateTestDto } from './dto/create-test.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // Admin-only: Retrieve test details and results by testId
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':testId')
  async findOne(@Param('testId') id: string) {
    const test = await this.testsService.findOne(id);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  // End-user: Retrieve test details using a unique URL
  @Get(':uniqueURL')
  async findOneByURL(@Param('uniqueURL') uniqueURL: string) {
    const test = await this.testsService.findOneByURL(uniqueURL);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  // End-user: Start a new adaptive test
  @UseGuards(JwtAuthGuard)
  @Post(':testId/start')
  async startTest(@Param('testId') id: string) {
    return this.testsService.startTest(id);
  }

  // End-user: Submit an answer for a question and get the next question
  @UseGuards(JwtAuthGuard)
  @Post(':testId/questions/:questionId/answer')
  async submitAnswer(
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.testsService.submitAnswer(testId, questionId, submitAnswerDto.answer);
  }
}

export class CreateQuestionDto {
  readonly text: string;
  readonly options: string[];
  readonly correctAnswer: string;
  readonly difficulty: number; // 1 to 10
}

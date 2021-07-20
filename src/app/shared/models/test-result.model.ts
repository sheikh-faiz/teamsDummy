export interface TestResultModel {
  elapsedTime: PollRequestModel;
  isPassed: boolean;
  language: string;
  scoredPercentage: number;
  sections?: SectionResultResponseModel[];
  title: string;
  totalQuestions: number;
  totalScore: number;
  userScore: number;
}

export interface QuestionInResultModel {
  answers: OptionModel[];
  explanation?: null | string;
  labels?: LabelModel[];
  maxAnswers: number;
  options?: OptionModel[];
  question: string;
  questionScore: number;
  questionType: string;
  referenceLinks?: null | string[];
  userAnswers?: UserResultResponseModel[];
  userScore: number;
}
export interface UserResultResponseModel {
  key: string;
  value: string;
  isCorrect: boolean;
}

export interface SectionResultResponseModel {
  overview: string;
  questions: QuestionInResultModel[];
  sectionType: string;
}
export interface OptionModel {
  key: string;
  value: string;
  notAttempt?: null | boolean;
}
export interface LabelModel {
  key: string;
  value: string;
  options?: OptionModel[];
}
export interface PollRequestModel {
  elapsedTime: string;
}
export interface SendFeedbackModel {
  experienceRating: number;
  questionsQualityRating: number;
  feedback: string;
}


// tslint:disable-next-line: no-empty-interface
export interface Tags { }
export interface TestListModel {
  examUniqueName: string;
  // languages: Languages[];
  minutesToComplete: number;
  overview: string;
  passPercentage: number;
  productId: string;
  productType: string;
  tags: Tags[];
  title: string;
  totalQuestions: number;
  totalSections: number;
  version?: null | string;
  examInstanceUniqueName: string;
  hasAssignedVoucher: boolean;
  hasInstanceNotCompleted: boolean;
  instruction?: null | string;
  isFree: boolean;
  canUseActivationCode: boolean;
  language: string;
  thumbnail: string;
}

export interface CompletedTestListModel {
    title: string;
    startDate: string;
    scoredPercentage: number;
    totalScore: number;
    thumbnail: string;
    userScore: number;
}
export interface TestDetailsModel {
  examUniqueName: string;
  minutesToComplete: number;
  overview: string;
  passPercentage: number;
  productId: string;
  productType: string;
  tags: Tags[];
  title: string;
  totalQuestions: number;
  totalSections: number;
  version?: null | string;
  instruction?: null | string;
  isFree: boolean;
  language: string;
  thumbnail: string;
  examInstanceUniqueName?: string | null;
  hasInstanceNotCompleted?: boolean | null;
}

export interface SectionModel {
  examSectionUniqueName: string;
  overview?: null | string;
  reviewAllowed: boolean;
  sectionType: string;
  tabs: TabModel[];
  totalQuestions: number;
  inProgress: boolean;
  instruction?: null | string;
  isSubmitted: boolean;
}
export interface TabModel {
  content?: null | string;
  subTabs: SubTabModel[];
  title: string;
  open?: null | boolean;
  active?: null | boolean;
}
export interface SubTabModel {
  content?: null | string;
  subTabs: SubTabModel[];
  title: string;
  open?: null | boolean;
  active?: null | boolean;
}

export interface QuestionModel {
  explanation: string;
  labels: LabelModel[];
  maxAnswers: number;
  options: OptionModel[];
  question: string;
  questionType: string;
  questionUniqueName: string;
  referenceLinks?: null | [];
  reviewLater?: null | string;
  userAnswers: UserResponseModel[];
  inProgress: boolean;
  instruction?: null | string;
  note: string;
}

export interface OptionModel {
  key: string;
  value: string;
  disabled?: null | boolean;
}
export interface LabelModel {
  key: string;
  value: string;
}
export interface PollRequestModel {
  elapsedTime: string;
}
export interface PollResponseModel {
  status: string;
  message: string;
}
export interface UserResponseModel {
  key: string;
  value: string;
}
export interface ExamInstaceDetailsModel {
  examUniqueName: string;
  language: string;
  minutesToComplete: number;
  sections: SectionModel[];
  tags: Tags[];
  elapsedTime: PollRequestModel;
  startDate: string;
}



import { SectionModel } from './common.model';
export interface CreatedExamInstaceDetailsModel {
  examInstanceUniqueName: string;
  minutesToComplete: string;
  language: string;
  sections: SectionModel[];
}

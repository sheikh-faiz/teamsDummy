import { SubTabModel, TabModel } from './common.model';

export interface ActiveSubTabModel {
  subTabsValue: SubTabModel[];
  showQuestionsValue: boolean;
}
export interface ActiveTabModel {
  tabsValue: TabModel[];
  showQuestionsValue: boolean;
}
export interface CloseSubTabModel {
  tabsValue: TabModel[];
  subTabsValue: SubTabModel[];
}

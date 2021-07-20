// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserSessionService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { KeyPairModel } from '../shared/models/keypair.model';
import { LanguageModel } from '@app/shared/models/language.model';

import { languageConst } from '@app/shared/const/language.const';
import { miscellaneousConst } from '../shared/const/miscellaneous.const';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private isTeamUser = false;
  private isCloudUser = false;
  private isDevUser = false;
  public languageConst = languageConst.lang;

  private originalKeyPair: KeyPairModel;
  private keyPair: KeyPairModel;

  private modifiedKey = '';

  public defaultLanguage: LanguageModel;

  public languageOptions: LanguageModel [] = [];

  public questionList = [];

  constructor(private readonly translateService: TranslateService) {
    this.defaultLanguage = {
      value: miscellaneousConst.language.defaulLang.value,
      label: miscellaneousConst.language.defaulLang.label
    };
  }

  public setDefaultLanguage(lang: LanguageModel): any {
    this.defaultLanguage = (lang);
  }

  public getDefaultLanguage(): LanguageModel {
    return this.defaultLanguage;
  }

  public setLanguageOptions(): void {
    this.languageConst.forEach(element => {
      const el = element.split('-');
      this.languageOptions.push({
        value: el[0],
        label: el[1]
      });
    });
  }

  public translateLanguage(langSelection: any): void {
    this.translateService.use(langSelection.val);
    this.defaultLanguage.label = langSelection.label;
  }

  /**
   * @description To set original key pair
   */
  public setOriginalKeyPair(publicKey: string, privateKey: string): void {
    this.originalKeyPair = new KeyPairModel();
    this.originalKeyPair.public = publicKey;
    this.originalKeyPair.private = privateKey;
  }

  /**
   * @description To get original key pair
   */
  public getOriginalKeyPair(): KeyPairModel {
    return this.originalKeyPair;
  }

  /**
   * @description To set modified key pair
   */
  public setKeyPair(publicKey: string, privateKey: string): void {
    this.keyPair = new KeyPairModel();
    this.keyPair.public = publicKey;
    this.keyPair.private = privateKey;
  }

  /**
   * @description To get modified key pair
   */
  public getKeyPair(): KeyPairModel {
    return this.keyPair;
  }

  public setModifiedKey(key: string): void {
    this.modifiedKey = key;
  }

  public getModifiedKey(): string {
    return this.modifiedKey;
  }

  get isTeamsAppUser(): boolean {
    return this.isTeamUser;
  }
  set isTeamsAppUser(val) {
    this.isTeamUser = val;
  }
  get isClouldLabsUser(): boolean {
    return this.isCloudUser;
  }
  set isClouldLabsUser(val) {
    this.isCloudUser = val;
  }
  get isLocalDevUser(): boolean {
    return this.isDevUser;
  }
  set isLocalDevUser(val) {
    this.isDevUser = val;
  }

}

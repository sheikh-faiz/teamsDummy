import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { miscellaneousConst } from '@shared/const/miscellaneous.const';

import { CreateExamInstaceRequestModel } from '@shared/models/test-list.model';
import { TestListModel } from '../../image-grid/interfaces/image-grid.interface';

import { AuthService } from '@shared/services/auth.service';
// import { EventEmitterService } from '@app/services/event-emitter.service';
// import { imgGrid } from '@shared/services/common/common-service.service';
import { UserSessionService } from '@app/services/user-session.service';
import { TranslateService } from '@ngx-translate/core';

import {
  unsubscribeCollection,
  formatter,
} from '@shared/utils/common-utilities.util';
import { ImageGridService } from '@app/image-grid/services/image-grid.service';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
})
export class TestListComponent implements OnInit, OnDestroy {
  public examTest = false;
  public allTestList: TestListModel[] = [];
  public selectedTestInstanceDetail: TestListModel;
  public serviceIsLoading = false;
  public popupLoading = false;
  public miscellaneousConst = miscellaneousConst;
  public redirectLink = { type: miscellaneousConst.actions.take, url: '' };

  public voucherCode = '';
  public activationCode = '';
  private tabIndex = 0;

  public submitButtonClicked = false;
  public voucherMessage = { text: '', value: '' };
  private subscriptions: Subscription[] = [];
  private prouctId = environment.productId;
  public isTeamapp: string;
  public cssWidth = true;

  constructor(
    public userSessionService: UserSessionService,
    private router: Router,
    private authService: AuthService,
    // private eventEmitter: EventEmitterService,
    // private commonService: CommonService,
    private readonly deviceDetectorService: DeviceDetectorService,
    private readonly translateService: TranslateService,
    private imgGrid: ImageGridService
  ) { }

  ngOnInit(): void {
    this.isTeamapp = localStorage.getItem('isTeamapp');
    this.loadTest();
  }

  /**
   * @description self explanatory
   */
  public checkIfOnlyActivationCodeVisible(): boolean {
    return (
      this.redirectLink.type !== miscellaneousConst.actions.continue &&
      this.selectedTestInstanceDetail?.isFree === true &&
      this.selectedTestInstanceDetail?.canUseActivationCode === true &&
      !this.userSessionService.isTeamsAppUser
    );
  }

  /**
   * @description self explanatory
   */
  public checkIfOnlyVoucherCodeVisible(): boolean {
    return (
      this.redirectLink.type !== miscellaneousConst.actions.continue &&
      this.selectedTestInstanceDetail?.isFree === false &&
      this.selectedTestInstanceDetail?.hasAssignedVoucher === false &&
      this.selectedTestInstanceDetail?.canUseActivationCode === false &&
      !this.userSessionService.isTeamsAppUser
    );
  }
  /**
   * @description self explanatory
   */
  public checkIfOnlyVoucherCodeVisibleTeam(): boolean {
    return (
      this.redirectLink.type !== miscellaneousConst.actions.continue &&
      this.selectedTestInstanceDetail?.isFree === false &&
      this.selectedTestInstanceDetail?.hasAssignedVoucher === false &&
      this.userSessionService.isTeamsAppUser
    );
  }

  /**
   * @description self explanatory
   */
  public checkIfVoucherCodeAndActivationCodeVisible(): boolean {
    return (
      this.redirectLink.type !== miscellaneousConst.actions.continue &&
      this.selectedTestInstanceDetail?.isFree === false &&
      this.selectedTestInstanceDetail?.hasAssignedVoucher === false &&
      this.selectedTestInstanceDetail?.canUseActivationCode === true &&
      !this.userSessionService.isTeamsAppUser
    );
  }

  /**
   * @description For tab change for Voucher and Activation code, reinitialize previous tab value
   */
  public onTabChange(event): void {
    this.tabIndex = event.index;
    if (this.tabIndex === 0) {
      this.voucherCode = '';
    } else {
      this.activationCode = '';
    }
  }

  /**
   * @description: Load Data first time
   */
  private loadTest(): void {
    console.log('Load test');
    this.authService.getToken().subscribe((token) => {
      console.log('Token', token);
      if (token !== '') {
        this.serviceIsLoading = true;
        this.subscriptions[this.subscriptions.length] = this.imgGrid
          .getExam()
          .subscribe(
            (res) => {
              console.log('Inside get exam', res);
              this.allTestList = res;
              this.allTestList = this.allTestList.filter((i) =>
                this.prouctId.some((o) => i.productId === o)
              );
              this.allTestList.forEach((element) => {
                element.thumbnail = miscellaneousConst.http + element.thumbnail;
              });
              this.serviceIsLoading = false;
              console.log('Loader', this.serviceIsLoading);
            },
            (error) => {
              // this.eventEmitter.errorHandler(error.error.message);
            }
          );
      } 
      // else {
      //   if (this.deviceDetectorService.isMobile()) {
      //     // Strange fix for the Teams mobile app to show invisible red toaster for few seconds
      //     this.eventEmitter.errorHandlerForMobile('No token');
      //   }
      // }
    });
  }

  /**
   * @description: Open Exam Details Dialog
   */
  public openExamTest(data: any): void {
    this.updateInitialStateForVoucherActivationCode();
    this.examTest = true;
    this.voucherCode = '';
    this.submitButtonClicked = false;
    this.voucherMessage = { text: '', value: '' };
    if (data.hasInstanceNotCompleted) {
      this.redirectLink.type = miscellaneousConst.actions.continue;
    } else {
      this.redirectLink.type = miscellaneousConst.actions.take;
    }
    this.redirectLink.url = '/tests/' + data.examUniqueName + '/detail';
    this.selectedTestInstanceDetail = data;
  }

  /**
   * @description: Start/Continue Exam
   */
  // public takeTest(): void {
  //   if (this.checkForSelectedExam() === 1) {
  //     this.createExamInstaceForPaidExam();
  //   } else if (this.checkForSelectedExam() === 2) {
  //     this.callCreateInstance();
  //   } else if (this.checkForSelectedExam() === 3) {
  //     this.callCreateInstance();
  //   } else {
  //     this.router.navigate([this.redirectLink.url]);
  //   }
  // }

  /**
   * @description When any popup closes, set voucher and activation code to initial state
   */
  private updateInitialStateForVoucherActivationCode(): void {
    if (!this.examTest) {
      this.voucherCode = '';
      this.activationCode = '';
      this.tabIndex = 0;
    }
  }

  /**
   * @description: Call Create Instance api for free Exam
   */
  // private callCreateInstance(): void {
  //   this.submitButtonClicked = true;
  //   if (this.checkForVoucherCodeActivationCodeValueState()) {
  //     return;
  //   }
  //   this.submitButtonClicked = false;
  //   const model = this.getModelForCallCreateInstance();

  //   this.popupLoading = true;
  //   this.subscriptions[this.subscriptions.length] = this.imgGrid
  //     .createExamInstance(this.selectedTestInstanceDetail.examUniqueName, model)
  //     .subscribe(
  //       (res) => {
  //         this.popupLoading = false;
  //         if (!this.userSessionService.isTeamsAppUser && this.selectedTestInstanceDetail.canUseActivationCode) {
  //           this.createInstanceSuccess();
  //         } else {
  //           this.router.navigate([this.redirectLink.url]);
  //         }
  //       },
  //       (error) => {
  //         if (!this.userSessionService.isTeamsAppUser) {
  //           this.createInstanceErr(error);
  //         }
  //         this.popupLoading = false;
  //       }
  //     );
  // }

  /**
   * @description To set payload model for callCreateInstance() method
   */
  private getModelForCallCreateInstance(): CreateExamInstaceRequestModel {
    let model: CreateExamInstaceRequestModel;
    if (this.userSessionService.isTeamsAppUser) {
      model = {
        VoucherCode: '',
        ActivationCode: this.selectedTestInstanceDetail?.canUseActivationCode
          ? environment.activationCode
          : '',
      };
    } else {
      model = {
        VoucherCode: '',
        ActivationCode: this.selectedTestInstanceDetail?.canUseActivationCode
          ? this.activationCode
          : '',
      };
    }
    return model;
  }

  /**
   * @description self explanatory
   */
  private checkForVoucherCodeActivationCodeValueState(): boolean {
    if (this.checkIfVoucherCodeAndActivationCodeVisible()) {
      if (this.tabIndex === 0) {
        return (
          this.activationCode === '' &&
          this.redirectLink.type === miscellaneousConst.actions.take
        );
      } else {
        return (
          this.voucherCode === '' &&
          this.redirectLink.type === miscellaneousConst.actions.take
        );
      }
    } else if (this.checkIfOnlyActivationCodeVisible()) {
      return (
        this.activationCode === '' &&
        this.redirectLink.type === miscellaneousConst.actions.take
      );
    } else if (this.checkIfOnlyVoucherCodeVisible()) {
      return (
        this.voucherCode === '' &&
        this.redirectLink.type === miscellaneousConst.actions.take
      );
    } else {
      return false;
    }
  }

  private createInstanceSuccess(): void {
    const successMessage =
      this.voucherCode === ''
        ? this.translateService.instant('message.activationCodeSuccessMessage')
        : '';
    this.voucherMessage = {
      text: this.translateService.instant('common.success'),
      // text: 'success',
      value: successMessage,
    };
    setTimeout(() => {
      this.router.navigate([this.redirectLink.url]);
    }, 1500);
  }

  private createInstanceErr(error): void {
    const errorMessage =
      this.voucherCode === ''
        ? this.translateService.instant('message.activationCodeFailureMessage')
        : this.translateService.instant('message.voucherFailureMessage');
    const finalMessage = error.error.message
      ? error.error.message
      : errorMessage;
    this.voucherMessage = {
      // text: 'error',
      text: this.translateService.instant('common.error'),
      value: finalMessage,
    };
  }

  /**
   * @description: Create Exam Instace for Paid Exam
   */
  // private createExamInstaceForPaidExam(): void {
  //   this.submitButtonClicked = true;
  //   if (this.checkForVoucherCodeActivationCodeValueState()) {
  //     return;
  //   }
  //   this.submitButtonClicked = false;
  //   const model: CreateExamInstaceRequestModel = {
  //     VoucherCode: this.voucherCode,
  //     ActivationCode: this.userSessionService.isTeamsAppUser
  //       ? environment.activationCode
  //       : this.activationCode,
  //   };
  //   this.popupLoading = true;
  //   this.subscriptions[this.subscriptions.length] = this.imgGrid
  //     .createExamInstance(this.selectedTestInstanceDetail.examUniqueName, model)
  //     .subscribe(
  //       (res) => {
  //         this.popupLoading = false;
  //         if (!this.userSessionService.isTeamsAppUser && this.selectedTestInstanceDetail.canUseActivationCode) {
  //           this.createInstanceSuccess();
  //         } else {
  //           this.router.navigate([this.redirectLink.url]);
  //         }
  //       },
  //       (error) => {
  //         if (!this.userSessionService.isTeamsAppUser) {
  //           this.createInstanceErr(error);
  //         }
  //         this.popupLoading = false;
  //       }
  //     );
  // }

  /**
   * @description: check condition selected exam
   */
  private checkForSelectedExam(): any {
    if (
      this.selectedTestInstanceDetail.hasInstanceNotCompleted === false &&
      this.selectedTestInstanceDetail?.examInstanceUniqueName === null &&
      this.selectedTestInstanceDetail?.isFree === false &&
      this.selectedTestInstanceDetail?.hasAssignedVoucher === false
    ) {
      return 1;
    } else if (
      this.selectedTestInstanceDetail.hasInstanceNotCompleted === false &&
      this.selectedTestInstanceDetail?.examInstanceUniqueName === null &&
      this.selectedTestInstanceDetail?.isFree === true
    ) {
      return 2;
    } else if (
      this.selectedTestInstanceDetail?.hasInstanceNotCompleted === false &&
      this.selectedTestInstanceDetail?.examInstanceUniqueName === null &&
      this.selectedTestInstanceDetail?.isFree === false &&
      this.selectedTestInstanceDetail?.hasAssignedVoucher === true
    ) {
      return 3;
    } else {
      return 0;
    }
  }
  /**
   * @description: Formatting Exam Time
   */
  public formatter = (seconds: any) => {
    const time = Number(seconds * 60);
    return formatter(time);
  }

  /**
   * @description: Is Free Test or Paid Test
   */
  public fetchTestType(i): string {
    if (i !== undefined) {
      if (i === true) {
        return this.translateService.instant('exam.common.freeTest');
      } else {
        return this.translateService.instant('exam.common.paidTest');
      }
    }
  }

  /**
   * @description: Close Notification Messagebar
   */
  public closeNotification(): void {
    this.voucherMessage = { text: '', value: '' };
  }

  /**
   * @description to get a language for localization
   */

  public getLanguage(ln: string): void {
    // this.userSessionService.translateLanguage(ln);
  }

  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}

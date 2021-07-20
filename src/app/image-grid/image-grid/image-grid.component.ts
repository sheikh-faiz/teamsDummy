import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

import { ImageGrid, TestListModel } from '../interfaces/image-grid.interface';
import { ImageGridService } from '../services/image-grid.service';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent implements OnInit {
  images: ImageGrid[] = [];
  allTestList: TestListModel[] = [];
  public examTest = false;
  public selectedTestInstanceDetail: TestListModel;
  public serviceIsLoading = false;
  public popupLoading = false;

  public voucherCode = '';
  public activationCode = '';
  private tabIndex = 0;

  public submitButtonClicked = false;
  public voucherMessage = { text: '', value: '' };
  private subscriptions: Subscription[] = [];
  public isTeamapp: string;

  constructor(private imgGrid: ImageGridService, private authService: AuthService,) {}

  ngOnInit() {
    this.isTeamapp = localStorage.getItem('isTeamapp');
    this.loadTest();
    // this.imgGrid.getData().subscribe(list => this.allTestList = list);
    this.imgGrid.getImages().subscribe(images => this.images = images);
  }

  private loadTest(): void {
    console.log('Load test');
    this.authService.getToken().subscribe((token) => {
      console.log('Token 1', token);
      if (token !== '') {
        this.serviceIsLoading = true;
        this.subscriptions[this.subscriptions.length] = this.imgGrid
          .getExam()
          .subscribe(
            (res) => {
              console.log('Inside get exam', res);
              this.allTestList = res;
              // this.allTestList = this.allTestList.filter((i) =>
              //   this.prouctId.some((o) => i.productId === o)
              // );
              // this.allTestList.forEach((element) => {
              //   element.thumbnail = miscellaneousConst.http + element.thumbnail;
              // });
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
}

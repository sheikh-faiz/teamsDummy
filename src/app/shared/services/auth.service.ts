// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
// import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authToken: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  public getToken(): any {
    return this.authToken.asObservable();
  }

  public setToken(token: any): void {
    this.authToken.next(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('msal.idtoken', token);
  }

  public setTokenForExternal(token: any): void {
    this.authToken.next(token);
  }

  /**
   * @description To clear local storage and session storage and logout from the app
   */
  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('msal.idtoken');
    localStorage.setItem('isLogginProcessed', '');
    sessionStorage.clear();
    // this.msalService.logout();
  }
}

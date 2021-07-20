// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class MicrosoftService {

//   constructor() { }
// }

import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as microsoftTeams from '@microsoft/teams-js';
import { TranslateService } from '@ngx-translate/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';

import { AuthService } from '../shared/services/auth.service';

import { unsubscribeCollection, getSilentRenewIntervalTime } from '../shared/utils/common-utilities.util';


@Injectable({
  providedIn: 'root',
})
export class MicrosoftService implements OnDestroy {
  isIframe = false;
  subscriptions: Subscription[] = [];
  isSession = 0;
  constructor(
    private authService: AuthService,
    private readonly translateService: TranslateService,
    private msalService: MsalService,
    private broadcastService: BroadcastService,
  ) { }

  public microsoftAppAuth(): void {
    microsoftTeams.registerOnThemeChangeHandler((theme) => {
      setTheme(theme);
    });

    function setTheme(theme: any): void {
      if (theme) {
        // DO NOT ADD THEME BECAUSE WE ARE PROVIDING OUR OWN TEAMS THEME
      }
    }
    const authTokenRequest = {
      successCallback: (result: any) => {
        this.authService.setToken(result);
        localStorage.setItem('token', result);
        microsoftTeams.appInitialization.notifySuccess(); // important in case of "showLoadingIndicator": true in manifest file
        localStorage.setItem('msteam', '1');
      },

      failureCallback: (error: any) => {
        console.log('Microsoft login error', error);
      },
    };
    microsoftTeams.getContext((context) => {
      if (context) {
        if (context.theme) {
          setTheme(context.theme);
        }
        if (context.locale !== undefined && context.locale !== '') {
          this.translateService.use(context.locale.match(/es|es-ES/) ? 'es' : 'en');
        }
      }
      microsoftTeams.authentication.getAuthToken(authTokenRequest);
    });
  }

  public isMicrosoftAppAuth(): void {
    console.log('outsde ms team outside');
    const isLogin = localStorage.getItem('authToken');
    const isLogginProcessed = localStorage.getItem('isLogginProcessed');
    if (isLogginProcessed !== '1') {
      if (isLogin === '' || isLogin == null || !isLogin || (getSilentRenewIntervalTime(isLogin) < 0)) {
        this.msalService.loginRedirect();
        localStorage.setItem('isLogginProcessed', '1');
      } else {
        this.authService.setToken(isLogin);
        localStorage.setItem('token', isLogin)
      }
    }

    this.isIframe = window !== window.parent && !window.opener;

    this.subscriptions[
      this.subscriptions.length
    ] = this.broadcastService.subscribe('msal:loginSuccess', (res) => {
      localStorage.setItem('isLogginProcessed', '');
      localStorage.setItem('authToken', res.idToken.rawIdToken);
      this.authService.setToken(res.idToken.rawIdToken);
      localStorage.setItem('token', res.idToken.rawIdToken)
      this.isSession = 1;
      const date = new Date();
      date.setTime(date.getTime() + 1810 * 1000);
      document.cookie =
        'sessionValue=' +
        this.isSession +
        ';' +
        'expires=' +
        date.toUTCString();
    });

    this.subscriptions[
      this.subscriptions.length
    ] = this.broadcastService.subscribe('msal:loginFailure', (error) => {
      console.log('Login Fails:', error);
    });

    this.msalService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
    });
  }

  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}

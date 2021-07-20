import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { TranslateService } from '@ngx-translate/core';
import * as forge from 'node-forge';

import { AuthService } from './shared/services/auth.service';
import { MicrosoftService } from './services/microsoft.service';
import { ActivatedRoute } from '@angular/router';
import { UserSessionService } from './services/user-session.service';
import { interval, Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { getSilentRenewIntervalTime, unsubscribeCollection, inIframe, isExternalFlowRegUniqueName } from './shared/utils/common-utilities.util';
import { updateKey, removeHeaderTrailerFromKey } from './shared/utils/encryption-util';

import { environment } from '../environments/environment';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from 'msal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'task1';
  private teamsInitialized = false;
  isLogginProcessed = localStorage.getItem('isLogginProcessed');
  isUser = true;
  title = 'exam';
  public serviceIsLoading = true;

  private params: any;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
              public userSessionService: UserSessionService,
              private microsoftService: MicrosoftService,
              private readonly authService: AuthService,
              private readonly route: ActivatedRoute,
              private readonly translateService: TranslateService,
              private readonly deviceDetectorService: DeviceDetectorService,
              private msalService: MsalService,
              private broadcastService: BroadcastService,
  ) {
    microsoftTeams.initialize();
    this.processLocalization();
    microsoftTeams.appInitialization.notifySuccess();
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
  }
  

  // ngOnInit(): void {
  //   microsoftTeams.initialize(() => {
  //     console.log('APP teams');
  //     this.teamsInitialized = true;
  //     localStorage.setItem('theme', 'default');
  //   });
  //   setTimeout(() => {
  //     this.appExecutionForSetTimeOut();
  //   }, 1500);

  // }

  // private appExecutionForSetTimeOut(): void {
  //   if (this.teamsInitialized) {
  //     this.microsoftAppAuth();
  //     localStorage.setItem('isTeamapp', 'true');
  //   }
  // }


  // public microsoftAppAuth(): void {
  //   microsoftTeams.registerOnThemeChangeHandler((theme) => {
  //     setTheme(theme);
  //   });
  
  //   function setTheme(theme: any): void {
  //     if (theme) {
  //       // DO NOT ADD THEME BECAUSE WE ARE PROVIDING OUR OWN TEAMS THEME
  //     }
  //   }
  //   const authTokenRequest = {
  //     successCallback: (result: any) => {
  //       localStorage.setItem('token', result);console.log('Inside success', result);
  //       localStorage.setItem('msteam', '1');
  //     },
  
  //     failureCallback: (error: any) => {
  //       console.log('Microsoft login error', error);
  //     },
  //   };
  //   microsoftTeams.getContext((context) => {
  //     if (context && context.theme) {
  //       setTheme(context.theme);
  //     }
  //     microsoftTeams.authentication.getAuthToken(authTokenRequest);
  //   });
  // }
  ngOnInit(): void {
    // this.userSessionService.setLanguageOptions();
    if (this.isLogginProcessed === '1') {
      localStorage.clear();
    }
    microsoftTeams.initialize(() => {
      this.teamsInitialized = true;
      localStorage.setItem('theme', 'default');
      this.document.body.classList.add('theme-default');
    });

    setTimeout(() => {
      this.appExecutionForSetTimeOut();
    }, 1500);

    this.generateRSAKeyPair();
  }

  /**
   * @description To execute in interval of 2 seconds on app load
   */
  private appExecutionForSetTimeOut(): void {
    if (this.teamsInitialized) {
      this.microsoftService.microsoftAppAuth();
      localStorage.setItem('isTeamapp', 'true');
      this.userSessionService.isTeamsAppUser = true;
    } else if (inIframe() || this.deviceDetectorService.isMobile()) {
      // Double check and execute code for inside teams flow
      localStorage.setItem('isTeamapp', 'true');
      this.microsoftService.microsoftAppAuth();
      this.userSessionService.isTeamsAppUser = true;
    } else {
      this.outSideFlow();
    }
    this.initializeTheme();
    this.serviceIsLoading = false;
  }

  /**
   * @description To initialize and set default theme for the user
   */
  private initializeTheme(): void {
    if (this.userSessionService.isTeamsAppUser) {
      localStorage.setItem('theme', 'default');
    } else {
      localStorage.setItem('theme', 'blue');
    }
    const theme = localStorage.getItem('theme')
      ? localStorage.getItem('theme')
      : 'default';
    this.document.body.classList.add('theme-' + theme);
  }


  /**
   * @description To generate RSA key pair
   * For now, only generating once for the app
   * Can be changed later to support unique generation for every API call
   */
  private generateRSAKeyPair(): void {

    const rsa = forge.pki.rsa;
    const keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey).trim();
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey).trim();
    this.userSessionService.setOriginalKeyPair(publicKey, privateKey);
    this.userSessionService.setKeyPair(removeHeaderTrailerFromKey(publicKey), removeHeaderTrailerFromKey(privateKey));
    this.updateKey();
  }

  /**
   * @description To update key
   */
  private updateKey(): void {
    const publicKey = this.userSessionService.getKeyPair().public;
    const newKey = updateKey(publicKey);
    this.userSessionService.setModifiedKey(newKey);
  }

  /**
   * @description To call interval method based on renew token time provided
   */
  private renewTokenCallOnInterval(): void {
    this.authService.getToken().subscribe((token) => {
      if (token && !this.teamsInitialized && !this.userSessionService.isClouldLabsUser) {
        if (getSilentRenewIntervalTime(token) < 0) {
          this.authService.logout();
        } else {
          this.subscriptions[this.subscriptions.length] =
            interval((getSilentRenewIntervalTime(token) * 60 * 1000)).subscribe(x => {
            this.getSilentToken();
          });
        }
      }
    });
  }

  /**
   * @description To get silent renew token
   */
  private getSilentToken(): void {

    const renewIdTokenRequest = {
      scopes: [environment.clientId]
    };

    this.msalService.acquireTokenSilent(renewIdTokenRequest).then(response => {
      if (response.idToken.rawIdToken !== '' && response.idToken.rawIdToken !== undefined && response.idToken.rawIdToken !== null) {
        this.authService.setToken(response.idToken.rawIdToken);
      }
    }).catch(error => {
      // if it is an InteractionRequired error, send the same request in an acquireToken call
      if (error instanceof InteractionRequiredAuthError) {
        console.log('Renew token Error Log', error);
        this.getSilentToken();
      }
    });
  }

  /**
   * @description Only process for outside flow and not Teams app flow
   */
  private outSideFlow(): void {
    console.log('outsde');
    if (window.location.href.includes('/public') ||
      isExternalFlowRegUniqueName(this.params) ||
      window.location.href.includes('/download')) {
      this.authService.setTokenForExternal('external token');
      this.userSessionService.isClouldLabsUser = true;
    } else if (!environment.production) {
      localStorage.setItem('isTeamapp', 'false');
      this.microsoftService.isMicrosoftAppAuth();
      this.userSessionService.isLocalDevUser = true;
      this.renewTokenCallOnInterval();
    } else {
      this.isUser = false;
    }
  }

  /**
   * @description Set current App language
   */
  private processLocalization(): void {
    this.translateService.addLangs(['en', 'es']);
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/es|es-ES/) ? 'es' : 'en');
  }

  /**
   * @description Component lifecycle method, gets called when component destroys
   */
   ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MsalModule } from '@azure/msal-angular';
import { TestListModule } from '@app/test-list/test-list.module';

import { environment } from '../environments/environment';

export function HttpLoaderFactory(httpClient: HttpClient): any {
  return new TranslateHttpLoader(httpClient);
}

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedDirectivesModule,
    TestListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MsalModule.forRoot(
      {
        auth: {
          clientId: environment.clientId,
          authority: environment.authority,
          redirectUri: environment.redirectUri,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        system: {
          tokenRenewalOffsetSeconds: 300
        }
      },
      {
        popUp: !isIE,
        consentScopes: ['user.read', 'openid', 'profile'],
        protectedResourceMap: [['https://graph.windows.net/me', ['user.read']]],
        extraQueryParameters: {},
      }
    ),
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
